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

// Helper to generate mock financial responses when n8n is offline or unconfigured
const getMockResponse = (message) => {
  const query = message.toLowerCase();

  // 1. Stock / Price Chart
  if (query.includes('stock') || query.includes('chart') || query.includes('graph') || query.includes('share price') || query.includes('price chart')) {
    return {
      output: `### Market Performance Overview
Here is the performance chart you requested. The stock shows positive growth over the past few weeks due to strong earnings and market demand.

\`\`\`json
{
  "type": "chart",
  "chartType": "area",
  "title": "Equity Portfolio Value (2026)",
  "xKey": "month",
  "yKeys": ["Growth Portfolio", "Fixed Income"],
  "data": [
    { "month": "Jan", "Growth Portfolio": 12000, "Fixed Income": 5000 },
    { "month": "Feb", "Growth Portfolio": 15000, "Fixed Income": 5100 },
    { "month": "Mar", "Growth Portfolio": 14200, "Fixed Income": 5150 },
    { "month": "Apr", "Growth Portfolio": 18500, "Fixed Income": 5200 },
    { "month": "May", "Growth Portfolio": 21000, "Fixed Income": 5300 },
    { "month": "Jun", "Growth Portfolio": 23500, "Fixed Income": 5400 }
  ]
}
\`\`\`

💡 **Tip**: Consider rebalancing your portfolio periodically to maintain your target asset allocation.`,
      responseType: "chart"
    };
  }

  // 2. Interactive Calculator / SIP
  if (query.includes('sip') || query.includes('calculator') || query.includes('invest') || query.includes('return')) {
    return {
      output: `### SIP Calculator Tool
To help you calculate your potential investment growth, here is an interactive **SIP Calculator** widget. You can adjust the sliders to test different monthly contributions, returns, and time frames:

\`\`\`json
{
  "type": "calculator"
}
\`\`\`

ℹ️ **Note**: SIP (Systematic Investment Plan) compounding works best over longer durations (e.g. 5+ years).`,
      responseType: "calculator"
    };
  }

  // 3. Risk Profile Meter
  if (query.includes('risk') || query.includes('profile') || query.includes('meter') || query.includes('assessment')) {
    return {
      output: `### Risk Assessment Tool
Based on your financial goals, here is your evaluated risk tolerance profile. Understanding your risk tolerance helps in allocating assets correctly:

\`\`\`json
{
  "type": "risk-meter",
  "data": {
    "level": "Moderate"
  }
}
\`\`\`

💡 **Remember**: Higher risk levels typically target aggressive capital growth, while lower risk levels prioritize wealth preservation.`,
      responseType: "risk-meter"
    };
  }

  // 4. Multi-Plan Options
  if (query.includes('plan') || query.includes('options') || query.includes('compare plans') || query.includes('itinerary')) {
    return {
      output: `### Financial Planning Packages
We have designed two custom plans tailored to your financial goals:

# Plan 1 - Steady Income focus
This plan prioritizes monthly dividends, high-yield debt funds, and capital preservation.
- Equity Allocation: 30%
- Debt Allocation: 70%
- Estimated Annual Yield: 7-9%

# Plan 2 - Aggressive Wealth Creator
This plan targets maximum compounding through small-cap, mid-cap equities and thematic tech ETFs.
- Equity Allocation: 85%
- Debt Allocation: 15%
- Estimated Annual Yield: 13-16%

### References
- [BIZRA Investment Guidelines](https://BIZRA.ai/guidelines)
- [Staging Market Trends](https://BIZRA.ai/market-trends)`,
      responseType: "plans-container"
    };
  }

  // 5. Comparison Table (renders table and supports chart conversion!)
  if (query.includes('table') || query.includes('compare') || query.includes('interest') || query.includes('saving') || query.includes('growth') || query.includes('comparison')) {
    return {
      output: `### Bank Interest Rates & Performance Comparison
Here is a comparison table of interest rates and projected returns for different savings and fixed-deposit accounts. Note that our interactive table allows you to switch to a chart view to visualize the difference!

| Institution | Savings Rate (%) | Fixed Deposit (%) | Recurring Deposit (%) |
|-------------|------------------|-------------------|-----------------------|
| HDFC Bank   | 3.5              | 7.1               | 6.9                   |
| SBI Bank    | 3.0              | 6.8               | 6.5                   |
| ICICI Bank  | 3.5              | 7.0               | 6.8                   |
| Axis Bank   | 3.7              | 7.2               | 7.0                   |
| Kotak Bank  | 4.0              | 7.3               | 7.1                   |

⚠️ **Caution**: Interest rates are subject to change based on central bank monetary policy updates.`,
      responseType: "table"
    };
  }

  // 6. Default fallback Response
  return {
    output: `### Welcome to BIZRA AI Support! ☄️
I am your smart financial planning assistant. I can render beautiful interactive tables, charts, calculators, and risk meters. 

Try asking me:
1. "Show me a stock chart"
2. "Compare bank interest rates in a table"
3. "Give me the SIP calculator"
4. "Check my risk profile"
5. "What are the options and plans?"

💡 **Tip**: Type **"table"** or **"chart"** to test the new interactive graph and table features directly!`,
    responseType: "question"
  };
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

    let botReplyText;
    let responseType;
    let fallbackMode = false;

    if (!N8N_WEBHOOK_URL) {
      console.warn("N8N_WEBHOOK_URL is not configured. Falling back to local mock responder.");
      fallbackMode = true;
    }

    if (!fallbackMode) {
      try {
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

        // 3. Parse n8n response layout defensively
        let responseData;
        const rawText = await response.text();
        if (rawText && rawText.trim() !== '') {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            try {
              responseData = JSON.parse(rawText);
            } catch (e) {
              responseData = rawText;
            }
          } else {
            responseData = rawText;
          }
        } else {
          responseData = "Request processed successfully.";
        }

        botReplyText = extractResponseText(responseData);
        responseType = extractResponseType(responseData);
      } catch (webhookErr) {
        console.warn("Failed to reach n8n webhook. Falling back to local mock responder:", webhookErr.message || webhookErr);
        fallbackMode = true;
      }
    }

    if (fallbackMode) {
      const mock = getMockResponse(message);
      botReplyText = mock.output;
      responseType = mock.responseType;
    }

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
