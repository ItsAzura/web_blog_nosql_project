import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import userController from './controllers/user.controller.js';
import roleController from './controllers/role.controller.js';
import categoryController from './controllers/category.controller.js';
import postController from './controllers/post.controller.js';
import commentController from './controllers/comment.controller.js';
import favoriteController from './controllers/favorite.controller.js';

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', //Cho fe kết nối
    methods: ['GET', 'POST'],
  },
});

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

//sự kiện khi có người kết nối
io.on('connection', (socket) => {
  console.log('A user connected');
  //sự kiện khi có người gửi comment
  socket.on('newComment', (comment) => {
    //gửi comment đến tất cả người dùng
    io.emit('newComment', comment);
  });

  //sự kiện khi có người gửi post
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
