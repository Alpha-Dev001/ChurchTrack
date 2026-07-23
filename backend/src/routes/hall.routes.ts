import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { upload, handleMulterError } from '../middlewares/upload.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';
import { createHall, deleteHall, getHallById, listHalls, updateHall } from '../services/hall.service';

export const hallRouter = Router();

hallRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const halls = await listHalls();
    return res.json(halls);
  })
);

hallRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const hall = await getHallById(req.params.id);
    if (!hall) return res.status(404).json({ error: 'Hall not found' });
    return res.json(hall);
  })
);

hallRouter.post(
  '/',
  authenticateJWT,
  upload.array('images', 5),
  handleMulterError,
  asyncHandler(async (req, res) => {
    const images = req.files as Express.Multer.File[];
    const hall = await createHall(req.body || {}, images);
    return res.status(201).json(hall);
  })
);

hallRouter.put(
  '/:id',
  authenticateJWT,
  upload.array('images', 5),
  handleMulterError,
  asyncHandler(async (req, res) => {
    const images = req.files as Express.Multer.File[];
    const hall = await updateHall(req.params.id, req.body || {}, images);
    if (!hall) return res.status(404).json({ error: 'Hall not found' });
    return res.json(hall);
  })
);

hallRouter.patch(
  '/:id',
  authenticateJWT,
  upload.array('images', 5),
  handleMulterError,
  asyncHandler(async (req, res) => {
    const images = req.files as Express.Multer.File[];
    const hall = await updateHall(req.params.id, req.body || {}, images);
    if (!hall) return res.status(404).json({ error: 'Hall not found' });
    return res.json(hall);
  })
);

hallRouter.delete(
  '/:id',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    const deleted = await deleteHall(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Hall not found' });
    return res.json({ success: true });
  })
);
