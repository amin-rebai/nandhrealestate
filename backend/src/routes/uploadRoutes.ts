import express from 'express';
import {
  uploadImage,
  handleImageUpload,
  uploadImages,
  handleImagesUpload,
  deleteImage,
  getUploadedImages
} from '../controllers/uploadController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Single image upload
router.post('/image', uploadImage, handleImageUpload);

// Multiple images upload
router.post('/images', uploadImages, handleImagesUpload);

// Get all uploaded images
router.get('/images', getUploadedImages);

// Delete image
router.delete('/:filename', authorize('admin', 'agent'), deleteImage);

export default router;
