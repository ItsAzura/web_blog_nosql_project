import express from 'express';
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from '../services/role.service.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllRoles, authenticate).post(createRole, authenticate);

router
  .route('/:id')
  .put(updateRole, authenticate)
  .delete(deleteRole, authenticate);

export default router;
