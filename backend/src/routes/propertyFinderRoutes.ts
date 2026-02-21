import express from 'express';
import {
  handleWebhook,
  syncAllProperties,
  syncSingleProperty,
  getWebhookStatus,
  setupWebhook,
  debugLocations
} from '../controllers/propertyFinderController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public webhook endpoint (receives events from Property Finder)
router.post('/webhook', handleWebhook);

// Protected admin routes
router.post('/sync', protect, authorize('admin'), syncAllProperties);
router.post('/sync/:identifier', protect, authorize('admin'), syncSingleProperty);

// Webhook management
router.get('/webhooks', protect, authorize('admin'), getWebhookStatus);
router.post('/webhooks', protect, authorize('admin'), setupWebhook);

// Debug endpoint - test locations API
router.get('/debug/locations', protect, authorize('admin'), debugLocations);

export default router;
