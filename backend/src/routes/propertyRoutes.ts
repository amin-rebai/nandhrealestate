import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
  getPortfolioProperties,
  toggleFeatured,
  togglePortfolio
} from '../controllers/propertyController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes for featured/portfolio properties (must be before /:id)
router.get('/featured', getFeaturedProperties);
router.get('/portfolio', getPortfolioProperties);

router.route('/')
  .get(getProperties)
  .post(protect, authorize('agent', 'admin'), createProperty);

// Toggle featured/portfolio status (Admin only)
router.put('/:id/featured', protect, authorize('admin'), toggleFeatured);
router.put('/:id/portfolio', protect, authorize('admin'), togglePortfolio);

router.route('/:id')
  .get(getProperty)
  .put(protect, authorize('agent', 'admin'), updateProperty)
  .delete(protect, authorize('agent', 'admin'), deleteProperty);

export default router;
