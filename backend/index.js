import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
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
    origin: 'http://localhost:3000', //Allow FE connection
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

//Socket events for real-time comments
io.on('connection', (socket) => {
  console.log('A user connected');

  // Broadcast new comments
  socket.on('newComment', (comment) => {
    io.emit('newComment', comment);
  });

  // Broadcast comment updates
  socket.on('updateComment', (updatedComment) => {
    io.emit('updateComment', updatedComment);
  });

  // Broadcast comment deletions
  socket.on('deleteComment', (commentId) => {
    io.emit('deleteComment', commentId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Serve static files from the 'uploads' folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
