import { Router } from 'express';
import { getAllStructures } from '../controllers/structureController.js';

const router = Router();

router.get('/', getAllStructures);

export default router;
