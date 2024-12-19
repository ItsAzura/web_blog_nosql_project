import asyncHandler from '../middlewares/asyncHandler.js';
import connectDB from '../db.js';
import Role from '../models/roles.js';

//Hàm này sẽ lấy tất cả các roles
const getAllRoles = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const roles = await Role.find();
    if (!roles) {
      return res.status(404).json({ message: 'No roles found' });
    }
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

//Hàm này sẽ tạo một role mới
const createRole = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400).send('Name is required');
    return;
  }

  try {
    await connectDB();
    const role = new Role({ name, description });
    if (!role) {
      res.status(400).send('Invalid role data');
      return;
    }
    const newRole = await role.save();

    res.json(newRole);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

//Hàm này sẽ cập nhật một role
const updateRole = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400).send('Name is required');
    return;
  }

  try {
    await connectDB();
    const role = await Role.findById(req.params.id);

    if (!role) {
      res.status(404).send('Role not found');
      return;
    }

    role.name = name;
    role.description = description;
    role.updatedAt = Date.now();

    const updatedRole = await role.save();
    res.json(updatedRole);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

//Hàm này sẽ xóa một role
const deleteRole = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const role = await Role.findById(req.params.id);

    if (!role) {
      res.status(404).send('Role not found');
      return;
    }

    await role.remove();
    res.json({ message: 'Role removed' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

export { getAllRoles, createRole, updateRole, deleteRole };
