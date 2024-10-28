import { setCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';

const createToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  setCookie('blog_token', token, {
    req: res.req,
    res: res.res,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days (seconds)
    sameSite: 'strict',
  });

  return token;
};

export default createToken;
