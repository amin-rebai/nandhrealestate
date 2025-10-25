import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  likeBlog,
  getBlogCategories,
  getBlogTags
} from '../controllers/blogController';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/categories', getBlogCategories);
router.get('/tags', getBlogTags);
router.get('/slug/:slug', getBlogBySlug);
router.post('/:id/like', likeBlog);

// Admin routes (these would typically be protected with authentication middleware)
router.get('/:id', getBlogById);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.patch('/:id/status', toggleBlogStatus);

export default router;
