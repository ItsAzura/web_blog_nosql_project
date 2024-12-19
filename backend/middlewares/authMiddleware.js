import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';

//Hàm này sẽ kiểm tra xem user đã đăng nhập chưa
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.blog_token;

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { authenticate };
