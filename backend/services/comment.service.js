import asyncHandler from '../middlewares/asyncHandler.js';
import connectDB from '../db.js';
import Comment from '../models/comments.js';
import { io } from '../index.js';

// Hàm này sẽ lấy tất cả các comments
const getAllComments = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const comments = await Comment.find();
    if (!comments) {
      return res.status(404).json({ message: 'No comments found' });
    }
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

// Hàm này sẽ lấy tất cả các comments của một post
const getCommentsByPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  try {
    await connectDB();
    const comments = await Comment.find({ postId }).populate({
      path: 'commenterId',
      model: 'User',
      select: 'username profilePicture',
    });
    if (!comments) {
      return res.status(404).json({ message: 'No comments found' });
    }
    res.json(comments);
  } catch (error) {
    console.error(error);
  }
});

// Hàm này sẽ lấy tất cả các comments của một user
const getCommentsByUser = asyncHandler(async (req, res) => {
  const commenterId = req.params.commenterId;

  try {
    await connectDB();
    const comments = await Comment.find({ commenterId }).populate({
      path: 'commenterId',
      model: 'User',
      select: 'username',
    });
    if (!comments) {
      return res.status(404).json({ message: 'No comments found' });
    }
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

// Hàm này sẽ tạo một comment mới
const createComment = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    let newComment = await Comment.create(req.body);

    newComment = await newComment.populate({
      path: 'commenterId',
      model: 'User',
      select: 'username profilePicture',
    });

    // Gửi comment mới tới tất cả các client
    io.emit('newComment', newComment);
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

// Hàm này sẽ cập nhật một comment
const updateComment = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    let updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    updatedComment = await updatedComment.populate({
      path: 'commenterId',
      model: 'User',
      select: 'username profilePicture',
    });

    // Gửi comment đã cập nhật tới tất cả các client
    io.emit('updateComment', updatedComment);
    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

// Hàm này sẽ xóa một comment
const deleteComment = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    await Comment.findByIdAndDelete(req.params.id);
    // Gửi id của comment đã xóa tới tất cả các client
    io.emit('deleteComment', req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

export {
  getAllComments,
  getCommentsByPost,
  getCommentsByUser,
  createComment,
  updateComment,
  deleteComment,
};
