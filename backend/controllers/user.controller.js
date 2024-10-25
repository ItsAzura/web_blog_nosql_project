import express from 'express';
import {
  getAllUsers,
  createUser,
  loginUser,
  logoutUser,
} from '../services/user.service.js';
import { authenticate } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/').get(getAllUsers, authenticate).post(createUser, authenticate);

router.route('/login').post(loginUser);

router.route('/logout').post(logoutUser);

export default router;
