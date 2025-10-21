import express from 'express';
import {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/change-password', protect, changePassword);

export default router;
