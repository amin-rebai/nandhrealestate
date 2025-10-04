import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, authorize('agent', 'admin'), createProperty);

router.route('/:id')
  .get(getProperty)
  .put(protect, authorize('agent', 'admin'), updateProperty)
  .delete(protect, authorize('agent', 'admin'), deleteProperty);

export default router;
