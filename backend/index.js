import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userController from './controllers/user.controller.js';
import roleController from './controllers/role.controller.js';
import categoryController from './controllers/category.controller.js';
import postController from './controllers/post.controller.js';
import commentController from './controllers/comment.controller.js';
import favoriteController from './controllers/favorite.controller.js';

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use('/api/users', userController);
app.use('/api/roles', roleController);
app.use('/api/categories', categoryController);
app.use('/api/posts', postController);
app.use('/api/comments', commentController);
app.use('/api/favorites', favoriteController);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send('Something broke!');
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
