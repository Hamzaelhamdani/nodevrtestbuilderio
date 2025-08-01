import { Router } from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  getAllCategories
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Temporarily disable auth for development - REMOVE IN PRODUCTION
// router.use(authenticateToken);


// Product routes
router.get('/all', getAllProducts); // Marketplace: all products, all startups
router.get('/categories', getAllCategories); // Debug: get all categories
router.get('/', getProducts);
router.post('/', createProduct);  // Development mode - auth handled in controller
router.get('/:id', getProduct);
router.put('/:id', updateProduct);  // Development mode - auth handled in controller
router.delete('/:id', deleteProduct);  // Development mode - auth handled in controller

export default router;
