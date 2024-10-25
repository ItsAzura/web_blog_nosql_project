import asyncHandler from '../middlewares/asyncHandler.js';
import connectDB from '../db.js';
import Favorite from '../models/favorites.js';

const getAllFavorites = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const favorites = await Favorite.find();
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const getFavoritesByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  try {
    await connectDB();
    const favorites = await Favorite.find({ user: userId });
    res.json(favorites);
  } catch (error) {
    console.error(error);
  }
});

const getFavoritesByPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  try {
    await connectDB();
    const favorites = await Favorite.find({ post: postId });
    res.json(favorites);
  } catch (error) {
    console.error(error);
  }
});

const createFavorite = asyncHandler(async (req, res) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await connectDB();
    const existingFavorite = await Favorite.findOne({
      user: userId,
      post: postId,
    });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Favorite already exists' });
    }

    const favorite = new Favorite({
      user: userId,
      post: postId,
    });

    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const deleteFavorite = asyncHandler(async (req, res) => {
  const favoriteId = req.params.id;

  try {
    await connectDB();
    await Favorite.findByIdAndDelete(favoriteId);
    res.json({ message: 'Favorite deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

export {
  getAllFavorites,
  getFavoritesByUser,
  getFavoritesByPost,
  createFavorite,
  deleteFavorite,
};