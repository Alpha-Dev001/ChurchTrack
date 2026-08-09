import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';
import SystemSettings from '../models/SystemSettings';

export const settingsRouter = Router();

// GET /api/settings - public endpoint to fetch current settings
settingsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      // Return defaults if none exist
      settings = await SystemSettings.create({
        siteName: 'ChurchTrack',
        siteTagline: 'Parish wedding and hall services',
        email: 'info@sallehub.rw',
        phone: '+250 788 000 000',
        address: 'Kigali, Rwanda',
        timeZone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
        currency: 'RWF',
        workingHours: '9:00 AM - 6:00 PM',
      });
    }
    return res.json(settings);
  })
);

// PUT /api/settings - update settings (admin only)
settingsRouter.put(
  '/',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    const allowedFields = [
      'siteName', 'siteTagline', 'email', 'phone', 'address',
      'timeZone', 'dateFormat', 'timeFormat', 'currency', 'workingHours',
      'logoUrl', 'faviconUrl'
    ];
    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const settings = await SystemSettings.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    return res.json(settings);
  })
);