import asyncHandler from '../middlewares/asyncHandler.js';
import connectDB from '../db.js';
import User from '../models/users.js';
import bcrypt from 'bcryptjs';
import createToken from '../utils/createToken.js';
import Role from '../models/roles.js';

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const createUser = asyncHandler(async (req, res) => {
  const { username, password, email, roleName } = req.body;

  if (!username || !password || !email || !roleName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 6 characters' });
  }

  try {
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: 'Role does not exist' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      roleId: role._id,
    });

    await user.save();

    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: role.name,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something broke!' });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await connectDB();
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    createToken(res, existingUser._id);

    res.status(200).json({
      message: 'User logged in successfully',
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.roleId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something broke!' });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('blog_token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'User logged out successfully' });
});

export { getAllUsers, createUser, loginUser, logoutUser };
