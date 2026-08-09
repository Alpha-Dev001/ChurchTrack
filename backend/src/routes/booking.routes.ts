import { Router } from 'express';
import { authenticateJWT, optionalAuthenticateJWT } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';
import { publicBookingRateLimiter, publicSearchRateLimiter } from '../middlewares/security.middleware';
import {
  createBooking,
  getBookingById,
  getPublicBookingSummary,
  getWeddingAvailability,
  listBookings,
  trackBookings,
  updateBookingStatus,
} from '../services/booking.service';

export const bookingRouter = Router();

bookingRouter.get(
  '/',
  authenticateJWT,
  asyncHandler(async (_req, res) => {
    const bookings = await listBookings();
    return res.json(bookings);
  })
);

/** Wedding slot availability — public, no auth */
bookingRouter.get(
  '/weddings/availability',
  publicSearchRateLimiter,
  asyncHandler(async (req, res) => {
    const date = String(req.query.date || '').trim();
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'date query param is required (YYYY-MM-DD)' });
    }
    const availability = await getWeddingAvailability(date);
    return res.json({ date, slots: availability });
  })
);

/** Public track lookup — must be registered before /:id */
bookingRouter.get(
  '/track/search',
  publicSearchRateLimiter,
  asyncHandler(async (req, res) => {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }
    const results = await trackBookings(q);
    return res.json({ results });
  })
);

bookingRouter.get(
  '/:id',
  optionalAuthenticateJWT,
  asyncHandler(async (req: any, res) => {
    if (req.user) {
      const booking = await getBookingById(req.params.id);
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      return res.json(booking);
    }

    const summary = await getPublicBookingSummary(req.params.id);
    if (!summary) return res.status(404).json({ error: 'Booking not found' });
    return res.json(summary);
  })
);

bookingRouter.post(
  '/',
  publicBookingRateLimiter,
  asyncHandler(async (req, res) => {
    const booking = await createBooking(req.body || {});
    return res.status(201).json({ booking });
  })
);

bookingRouter.patch(
  '/:id/approve',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    const booking = await updateBookingStatus(req.params.id, 'Approved');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.json(booking);
  })
);

bookingRouter.patch(
  '/:id/reject',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    const booking = await updateBookingStatus(req.params.id, 'Rejected');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.json(booking);
  })
);

bookingRouter.patch(
  '/:id/cancel',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    const booking = await updateBookingStatus(req.params.id, 'Cancelled');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.json(booking);
  })
);
