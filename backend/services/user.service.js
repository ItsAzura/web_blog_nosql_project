import asyncHandler from '../middlewares/asyncHandler.js';
import connectDB from '../db.js';
import User from '../models/users.js';
import bcrypt from 'bcryptjs';
import createToken from '../utils/createToken.js';
import Role from '../models/roles.js';

// Hàm này sẽ lấy tất cả các users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

// Hàm này sẽ tạo một user mới
const createUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  const roleName = 'user';

  if (!username || !password || !email || !roleName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 8 characters' });
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

    if (!user) {
      return res.status(400).json({ message: 'Invalid user data' });
    }

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

// Hàm này sẽ đăng nhập một user
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

    // Tạo token
    const token = createToken(res, existingUser._id);

    res.status(200).json({
      message: 'User logged in successfully',
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.roleId,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something broke!' });
  }
});

// Hàm này sẽ đăng xuất một user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('blog_token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'User logged out successfully' });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    await connectDB();
    const user = await User.findById(userId).populate({
      path: 'roleId',
      model: 'Role',
      select: 'name',
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something broke!' });
  }
});

// Hàm này sẽ cập nhật thông tin user
const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { username, email, password } = req.body;

  try {
    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profilePicture = user.profilePicture;
    if (req.file) {
      profilePicture = `/uploads/${req.file.filename}`;
    }

    // Kiểm tra xem user có nhập password mới không
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    user.username = username;
    user.email = email;
    user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something broke!' });
  }
});

export {
  getAllUsers,
  createUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateProfile,
};
