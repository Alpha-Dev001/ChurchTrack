import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { adminRouter } from './routes/admin.routes';
import { hallRouter } from './routes/hall.routes';
import { bookingRouter } from './routes/booking.routes';
import { settingsRouter } from './routes/settings.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

export const app = express();

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
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.get('/health', (_req, res) => {
  return res.json({ status: 'ok', service: 'sallehub-api' });
});

app.use('/api', adminRouter);
app.use('/api/halls', hallRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/settings', settingsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
