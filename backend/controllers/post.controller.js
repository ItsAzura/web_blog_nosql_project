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

const router = express.Router();

router
  .route('/')
  .get(getAllPosts, authenticate)
  .post(upload.single('coverImage'), createPost);

router.route('/top-liked').get(getTopLikedPosts, authenticate);

router.route('/latest').get(getLatestPosts, authenticate);

router
  .route('/:id')
  .get(getPostById, authenticate)
  .put(upload.single('coverImage'), updatePost)
  .delete(deletePost);

router.route('/user/:userId').get(getPostsByUser);

export default router;
