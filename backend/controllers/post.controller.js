import express from 'express';
import {
  getAllPosts,
  getTopLikedPosts,
  getLatestPosts,
  getPostById,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost,
} from '../services/post.service.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../services/upload.service.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getAllPosts, authenticate)
  .post(authenticate, upload.single('coverImage'), createPost);

router.route('/top-liked').get(getTopLikedPosts, authenticate);

router.route('/latest').get(getLatestPosts, authenticate);

router
  .route('/:id')
  .get(getPostById, authenticate)
  .put(authenticate, updatePost, upload.single('coverImage'))
  .delete(authenticate, deletePost);

router.route('/user/:userId').get(getPostsByUser);

export default router;
