import express from 'express';
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from '../services/role.service.js';

const router = express.Router();

router.route('/').get(getAllRoles).post(createRole);

router.route('/:id').put(updateRole).delete(deleteRole);

export default router;
