import express from 'express';
import {
  getContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  getContentBySection,
  reorderContent,
  toggleContentStatus
} from '../controllers/contentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getContent);
router.get('/section/:section', getContentBySection);
router.get('/:id', getContentById);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', createContent);
router.put('/reorder', reorderContent);
router.put('/:id', updateContent);
router.put('/:id/toggle', toggleContentStatus);
router.delete('/:id', deleteContent);

export default router;
