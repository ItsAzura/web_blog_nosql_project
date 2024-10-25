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
  .get(getAllPosts)
  .post(authenticate, upload.single('coverImage'), createPost);

router.route('/top-liked').get(getTopLikedPosts);

router.route('/latest').get(getLatestPosts);

router
  .route('/:id')
  .get(getPostById)
  .put(authenticate, updatePost, upload.single('coverImage'))
  .delete(authenticate, deletePost);

router.route('/user/:userId').get(getPostsByUser);

export default router;
