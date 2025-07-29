// backend/src/routes/meRoute.ts
import { Router } from 'express';
import { getMe } from '../controllers/meController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getMe);

export default router;
