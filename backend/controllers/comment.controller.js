import express from 'express';
import {
  getAllComments,
  getCommentsByPost,
  getCommentsByUser,
  createComment,
  updateComment,
  deleteComment,
} from '../services/comment.service.js';

const router = express.Router();

router.route('/').get(getAllComments).post(createComment);

router.route('/post/:postId').get(getCommentsByPost);

router.route('/user/:userId').get(getCommentsByUser);

router.route('/:id').put(updateComment).delete(deleteComment);

export default router;
