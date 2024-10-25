import asyncHandler from '../middlewares/asyncHandler.js';
import connectDB from '../db.js';
import Comment from '../models/comments.js';

const getAllComments = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const getCommentsByPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  try {
    await connectDB();
    const comments = await Comment.find({ postId });
    res.json(comments);
  } catch (error) {
    console.error(error);
  }
});

const getCommentsByUser = asyncHandler(async (req, res) => {
  const commenterId = req.params.commenterId;

  try {
    await connectDB();
    const comments = await Comment.find({ commenterId });
    res.json(comments);
  } catch (error) {
    console.error(error);
  }
});

const createComment = asyncHandler(async (req, res) => {
  const { postId, commenterId, comment, parentCommentId } = req.body;

  if (!postId || !commenterId || !comment) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await connectDB();
    const newComment = new Comment({
      postId,
      commenterId,
      comment,
      parentCommentId,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const updateComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ message: 'Comment is required' });
  }

  try {
    await connectDB();
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { comment, updatedAt: Date.now() },
      { new: true }
    );

    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
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
