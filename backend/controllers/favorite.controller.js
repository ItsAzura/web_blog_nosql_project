import express from 'express';
import {
  getAllFavorites,
  getFavoritesByUser,
  getFavoritesByPost,
  createFavorite,
  deleteFavorite,
} from '../services/favorite.service.js';

const router = express.Router();

router.route('/').get(getAllFavorites).post(createFavorite);

router.route('/user/:userId').get(getFavoritesByUser);

router.route('/post/:postId').get(getFavoritesByPost);

router.route('/:id').delete(deleteFavorite);

export default router;
