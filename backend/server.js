import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDb } from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Import routes
import authRoutes from './routes/authRoutes.js';
import travelRoutes from './routes/travelRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import pexelsRoutes from './routes/pexelsRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors());
app.use(express.json());

// Health Check Endpoints
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "OK", service: "BIZRA AI Backend", timestamp: new Date().toISOString() });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/pexels', pexelsRoutes);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: "NotFound", message: `Cannot ${req.method} ${req.url}` });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error encountered:", err);

  // Capture PostgreSQL duplicate key violations (unique constraint)
  if (err.code === '23505') {
    return res.status(409).json({
      error: "ConflictError",
      message: "Unique constraint violation. A record with this email or identifier already exists.",
      detail: err.detail
    });
  }

  // Capture PostgreSQL foreign key constraint violations
  if (err.code === '23503') {
    return res.status(400).json({
      error: "ForeignKeyViolation",
      message: "Reference constraint violation. The referenced parent record does not exist.",
      detail: err.detail
    });
  }

  // General server error fallback
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || "InternalServerError",
    message: err.message || "An unexpected server error occurred."
  });
});

// Start Server immediately
app.listen(PORT, () => {
  console.log(`BIZRA AI proxy server is running on port ${PORT}`);

  // Initialize Database asynchronously in the background
  initDb()
    .then(() => {
      console.log("Database initialized successfully on startup.");
    })
    .catch((err) => {
      console.error("CRITICAL: Failed to initialize database on startup. Service running with degraded status.", err);
    });
});
