import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAgents
} from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public route for agents
router.get('/agents', getAgents);

// All other routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
