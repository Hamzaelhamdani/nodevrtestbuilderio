import { Router } from 'express';
import { getAllStartups } from '../controllers/startupController.js';

const router = Router();

router.get('/', getAllStartups);

export default router;
