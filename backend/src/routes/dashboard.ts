import { Router } from 'express';
import { getOrders, getCustomers } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Temporarily disable auth for development - REMOVE IN PRODUCTION
// router.use(authenticateToken);

// Dashboard routes
router.get('/orders', getOrders);
router.get('/customers', getCustomers);

export default router;
