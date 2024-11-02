import express from 'express';
import {
  getAllUsers,
  createUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateProfile,
} from '../services/user.service.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../services/upload.service.js';
const router = express.Router();

router
  .route('/')
  .get(getAllUsers, authenticate)
  .post(upload.single('coverImage'), createUser, authenticate);

router.route('/login').post(loginUser);

router.route('/logout').post(logoutUser);

router
  .route('/profile/:userId')
  .get(getUserProfile, authenticate)
  .put(upload.single('coverImage'), updateProfile);

export default router;
