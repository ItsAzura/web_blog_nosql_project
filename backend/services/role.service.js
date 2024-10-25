import asyncHandler from '../middlewares/asyncHandler.js';
import connectDB from '../db.js';
import Role from '../models/roles.js';

const getAllRoles = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const createRole = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400).send('Name is required');
    return;
  }

  try {
    await connectDB();
    const role = new Role({ name, description });
    const newRole = await role.save();
    res.json(newRole);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

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
