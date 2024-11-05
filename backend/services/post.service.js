import asyncHandler from '../middlewares/asyncHandler.js';
import connectDB from '../db.js';
import Post from '../models/posts.js';
import Category from '../models/categories.js';
import mongoose from 'mongoose';

const getAllPosts = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const { title, categoryId, page, limit = 9 } = req.query;

    if (!page) {
      return res.status(400).json({ message: 'Page is required in query' });
    }

    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const posts = await Post.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'authorId',
        model: 'User',
        select: 'username',
      });

    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / parseInt(limit));

    if (!posts) {
      return res.status(404).json({ message: 'No posts found' });
    }

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPosts,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const getTopLikedPosts = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const posts = await Post.find()
      .populate({
        path: 'authorId',
        model: 'User',
        select: 'username',
      })
      .sort({ liked: -1 })
      .limit(3);
    if (!posts) {
      return res.status(404).json({ message: 'No posts found' });
    }
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const getLatestPosts = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const posts = await Post.find()
      .populate({
        path: 'authorId',
        model: 'User',
        select: 'username',
      })
      .sort({ createdAt: -1 })
      .limit(3);
    if (!posts) {
      return res.status(404).json({ message: 'No posts found' });
    }
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const getPostById = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'authorId',
        model: 'User',
        select: 'username',
      })
      .populate({
        path: 'categoryId',
        model: 'Category',
        select: 'name',
      });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const getPostsByUser = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const { title, categoryId, page = 1, limit = 9 } = req.query;
    const MAX_LIMIT = 100;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (!pageNum || pageNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Page must be a positive number',
      });
    }

    if (!limitNum || limitNum <= 0 || limitNum > MAX_LIMIT) {
      return res.status(400).json({
        success: false,
        message: `Limit must be between 1 and ${MAX_LIMIT}`,
      });
    }

    const authorId = req.params.userId;
    // Tạo filter object
    const filter = { authorId: authorId };

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const skip = (pageNum - 1) * limitNum;

    // Thực hiện 2 queries song song để tăng tốc độ
    const [posts, totalPosts] = await Promise.all([
      Post.find(filter)
        .select('title content createdAt imageUrl description')
        .populate({
          path: 'authorId',
          model: 'User',
          select: 'username',
        })
        .skip(skip)
        .limit(limitNum)
        .lean()
        .exec(),
      Post.countDocuments(filter),
    ]);

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No posts found',
      });
    }

    const totalPages = Math.ceil(totalPosts / limitNum);

    return res.json({
      success: true,
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPosts,
        totalPages,
      },
    });
  } catch (error) {
    console.error('GetPostsByUser Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

const createPost = asyncHandler(async (req, res) => {
  const { title, body, authorId, categoryName } = req.body;

  if (!title || !body || !authorId || !categoryName) {
    return res
      .status(400)
      .json({ message: 'Title, body, authorId, and categoryId are required' });
  }

  try {
    await connectDB();

    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(400).json({ message: 'Category not found' });
    }

    let coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    const post = new Post({
      title,
      body,
      authorId,
      categoryId: category._id,
      coverImage,
    });

    if (!post) {
      return res.status(400).json({ message: 'Post not created' });
    }

    await post.save();

    res.status(201).json({
      _id: post._id,
      title: post.title,
      body: post.body,
      authorId: post.authorId,
      categoryId: post.categoryId,
      coverImage: post.coverImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, body, authorId, categoryName } = req.body;

  try {
    await connectDB();

    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ message: 'Post not found' });
    }

    let coverImage = post.coverImage;
    if (req.file) {
      coverImage = `/uploads/${req.file.filename}`;
    }

    post.title = title;
    post.body = body;
    post.authorId = authorId;
    post.categoryId = category._id;
    post.coverImage = coverImage;

    await post.save();

    res.json({
      _id: post._id,
      title: post.title,
      body: post.body,
      authorId: post.authorId,
      categoryId: post.categoryId,
      coverImage: post.coverImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const deletePost = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const result = await post.deleteOne();
    if (!result) {
      return res.status(400).json({ message: 'Post not deleted' });
    }
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

export {
  getAllPosts,
  getTopLikedPosts,
  getLatestPosts,
  getPostById,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost,
};
