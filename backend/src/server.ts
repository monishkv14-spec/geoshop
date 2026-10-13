import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration — supports comma-separated origins for production
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Global rate limiting for API endpoints (300 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', limiter);

// Request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Primary API Routes
app.use('/api', apiRouter);

// Root health endpoint (for Railway health checks)
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'GeoShop Backend API',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found. Refer to GeoShop API documentation.',
  });
});

// Central Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 Server Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 GeoShop Backend API Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📦 Health Check: /api/health`);
});

export default app;
