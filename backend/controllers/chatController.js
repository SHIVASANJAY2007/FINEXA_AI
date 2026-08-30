import * as dbService from '../database/dbService.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const N8N_BASE_URL = process.env.N8N_BASE_URL;

// Helper to extract text from n8n response payloads
const extractResponseText = (data) => {
  if (!data) return "Thank you. I have processed your request.";
  if (typeof data === 'string') return data;

  if (Array.isArray(data)) {
    if (data.length === 0) return "Response received with no content.";
    const first = data[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object') {
      return first.output || first.response || first.text || first.message || first.content || first.reply || JSON.stringify(first);
    }
  }

  if (typeof data === 'object') {
    return data.output || data.response || data.text || data.message || data.content || data.reply || (data.data && extractResponseText(data.data)) || JSON.stringify(data);
  }

  return String(data);
};

// Helper to extract responseType metadata
const extractResponseType = (data) => {
  if (!data) return "question";
  if (typeof data === 'object') {
    if (Array.isArray(data) && data.length > 0) {
      return data[0].responseType || data[0].type || "question";
    }
    return data.responseType || data.type || "question";
  }
  return "question";
};

export const sendMessage = async (req, res, next) => {
  const { personId, sessionId, message } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: "sessionId and message are required." });
  }

  try {
    // 1. Log user message to database (non-blocking fallback)
    try {
      await dbService.saveMessage({
        person_id: personId || null,
        session_id: sessionId,
        role: 'user',
        message
      });
    } catch (dbErr) {
      console.warn("WARNING: Failed to log user message to database. Proceeding in degraded mode:", dbErr.message || dbErr);
    }

    if (!N8N_WEBHOOK_URL) {
      throw new Error("N8N_WEBHOOK_URL is not configured on the server.");
    }

    // 2. Forward payload to n8n webhook with 120s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds timeout

    let response;
    try {
      response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          personId: personId || "",
          sessionId,
          message,
          chatInput: message,
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      });
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        return res.status(544).json({ error: "n8n AI Agent took too long to respond (120s timeout exceeded)." });
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`n8n webhook responded with HTTP status ${response.status}`);
    }

    // 3. Parse n8n response layout
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    const botReplyText = extractResponseText(responseData);
    const responseType = extractResponseType(responseData);

    // 4. Log assistant's reply to database (non-blocking fallback)
    try {
      await dbService.saveMessage({
        person_id: personId || null,
        session_id: sessionId,
        role: 'assistant',
        message: botReplyText
      });
    } catch (dbErr) {
      console.warn("WARNING: Failed to log assistant reply to database. Proceeding in degraded mode:", dbErr.message || dbErr);
    }

    // 5. Return structured response to client
    res.status(200).json({
      output: botReplyText,
      responseType
    });
  } catch (error) {
    next(error);
  }
};

export const checkStatus = async (req, res, next) => {
  let targetUrl = N8N_BASE_URL;

  if (!targetUrl && N8N_WEBHOOK_URL) {
    try {
      targetUrl = new URL(N8N_WEBHOOK_URL).origin;
    } catch (e) {
      // invalid URL format, ignore
    }
  }

  if (!targetUrl) {
    return res.status(200).json({ success: true, online: false });
  }

  const pingUrl = new URL(targetUrl);
  pingUrl.searchParams.set('ngrok-skip-browser-warning', 'true');
  pingUrl.searchParams.set('skip_zrok_interstitial', 'true');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout threshold

    const response = await fetch(pingUrl.toString(), {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'skip_zrok_interstitial': 'true'
      }
    });

    clearTimeout(timeoutId);

    const isOnline = response.status === 200;
    res.status(200).json({ success: true, online: isOnline });
  } catch (err) {
    res.status(200).json({ success: true, online: false });
  }
};

export const getHistory = async (req, res, next) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required." });
  }

  try {
    const history = await dbService.getChatHistory(sessionId);
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};
