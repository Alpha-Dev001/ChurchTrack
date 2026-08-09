import { Router } from 'express';
import { authenticateJWT, requireSuperAdmin } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';
import { createManagedAdmin, deleteManagedAdmin, getStats, getSuperAdminInsights, handleLogin, listManagedAdmins, resetDatabase, updateManagedAdmin } from '../controllers/admin.controller';
import { authRateLimiter } from '../middlewares/security.middleware';

export const adminRouter = Router();

adminRouter.post('/auth/login', authRateLimiter, asyncHandler(handleLogin));
adminRouter.post('/admin/login', authRateLimiter, asyncHandler(handleLogin));

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

adminRouter.get('/superadmin/insights', authenticateJWT, requireSuperAdmin, asyncHandler(getSuperAdminInsights));
adminRouter.get('/superadmin/admins', authenticateJWT, requireSuperAdmin, asyncHandler(listManagedAdmins));
adminRouter.post('/superadmin/admins', authenticateJWT, requireSuperAdmin, asyncHandler(createManagedAdmin));
adminRouter.put('/superadmin/admins/:id', authenticateJWT, requireSuperAdmin, asyncHandler(updateManagedAdmin));
adminRouter.delete('/superadmin/admins/:id', authenticateJWT, requireSuperAdmin, asyncHandler(deleteManagedAdmin));
