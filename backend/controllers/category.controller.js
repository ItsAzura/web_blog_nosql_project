import express from 'express';
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../services/category.service.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getAllCategories, authenticate)
  .post(createCategory, authenticate);

router
  .route('/:id')
  .get(getCategoryById, authenticate)
  .put(updateCategory, authenticate)
  .delete(deleteCategory, authenticate);

export default router;
