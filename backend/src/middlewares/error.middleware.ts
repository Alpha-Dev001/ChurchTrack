import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  // express.json / urlencoded body size limit
  if (err && typeof err === 'object' && (err as { type?: string }).type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload too large. Upload images via multipart or use Cloudinary URLs instead of embedding large files in JSON.',
    });
  }

  if (err && typeof err === 'object' && 'name' in err) {
    const name = (err as { name?: string }).name;
    if (name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: (err as { message?: string }).message,
      });
    }
    if (name === 'CastError') {
      return res.status(400).json({ error: 'Invalid identifier' });
    }
    if (name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
      return res.status(409).json({ error: 'Duplicate record already exists' });
    }
  }

  console.error('[API Error]', err);
  return res.status(500).json({ error: 'Internal server error' });
}
