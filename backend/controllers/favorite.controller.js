import express from 'express';
import {
  getAllFavorites,
  getFavoritesByUser,
  getFavoritesByPost,
  createFavorite,
  deleteFavorite,
} from '../services/favorite.service.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getAllFavorites, authenticate)
  .post(createFavorite, authenticate);

router.route('/user/:userId').get(getFavoritesByUser, authenticate);

router.route('/post/:postId').get(getFavoritesByPost, authenticate);

router.route('/').delete(deleteFavorite, authenticate);

export default router;
