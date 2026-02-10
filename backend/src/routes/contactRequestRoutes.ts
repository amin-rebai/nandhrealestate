import express from 'express';
import {
  getContactRequests,
  createContactRequest,
  updateContactRequest,
  deleteContactRequest
} from '../controllers/contactRequestController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public route - create contact request
router.post('/', createContactRequest);

// Protected routes (Admin only)
// router.use(protect);
// router.use(authorize('admin'));

router.get('/', getContactRequests);
router.put('/:id', updateContactRequest);
router.delete('/:id', deleteContactRequest);

export default router;

