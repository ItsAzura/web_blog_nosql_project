import express from 'express';
import {
  getAllComments,
  getCommentsByPost,
  getCommentsByUser,
  createComment,
  updateComment,
  deleteComment,
} from '../services/comment.service.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getAllComments, authenticate)
  .post(createComment, authenticate);

router.route('/post/:postId').get(getCommentsByPost, authenticate);

router.route('/user/:userId').get(getCommentsByUser, authenticate);

router
  .route('/:id')
  .put(updateComment, authenticate)
  .delete(deleteComment, authenticate);

export default router;
