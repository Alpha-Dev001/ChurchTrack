import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';
import { getStats, handleLogin, resetDatabase } from '../controllers/admin.controller';

export const adminRouter = Router();

adminRouter.post('/auth/login', asyncHandler(handleLogin));
adminRouter.post('/admin/login', asyncHandler(handleLogin));

adminRouter.get(
  '/auth/me',
  authenticateJWT,
  asyncHandler(async (req: any, res) => {
    const user = req.user;
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'admin',
    });
  })
);

adminRouter.get('/stats', authenticateJWT, asyncHandler(getStats));
