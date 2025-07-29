import { Router } from 'express';
import { getAllStartups, getStartupDashboardKPIs, getStartupProducts, getStartupSupportStructures } from '../controllers/startupController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Products for the authenticated startup owner
router.get('/products', authenticateToken, getStartupProducts);
// Support structures for the authenticated startup owner
router.get('/support-structures', authenticateToken, getStartupSupportStructures);

// Dashboard KPIs for the authenticated startup owner
router.get('/dashboard/kpis', authenticateToken, getStartupDashboardKPIs);

router.get('/', getAllStartups);

export default router;
