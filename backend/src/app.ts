import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'node:crypto';
import { env } from './config/env';
import { adminRouter } from './routes/admin.routes';
import { hallRouter } from './routes/hall.routes';
import { bookingRouter } from './routes/booking.routes';
import { settingsRouter } from './routes/settings.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { apiRateLimiter } from './middlewares/security.middleware';

export const app = express();
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use((_req, res, next) => {
  const requestId = crypto.randomUUID();
  res.setHeader('X-Request-Id', requestId);
  res.locals.requestId = requestId;
  next();
});

const isProd = process.env.NODE_ENV === 'production';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  'https://sallehub.vercel.app',
  env.frontendUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      if (!isProd) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Hall create/update can include image URL arrays; file uploads use multer (separate from JSON).
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/health', (_req, res) => {
  return res.json({ status: 'ok', service: 'churchtrack-api' });
});

app.use('/api', apiRateLimiter);
app.use('/api', adminRouter);
app.use('/api/halls', hallRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/settings', settingsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
