import asyncHandler from '../middlewares/asyncHandler.js';
import connectDB from '../db.js';
import Post from '../models/posts.js';
import Category from '../models/categories.js';

const getAllPosts = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const { title, categoryId, page, limit = 10 } = req.query;

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
    const posts = await Post.find().sort({ liked: -1 }).limit(5);
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
    const posts = await Post.find().sort({ createdAt: -1 }).limit(8);
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
    const posts = await Post.find({ user: req.params.userId });
    if (!posts) {
      return res.status(404).json({ message: 'No posts found' });
    }
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
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
