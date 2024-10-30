import asyncHandler from '../middlewares/asyncHandler.js';
import connectDB from '../db.js';
import Category from '../models/categories.js';

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const categories = await Category.find();
    if (!categories) {
      return res.status(404).json({ message: 'No categories found' });
    }
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  try {
    await connectDB();
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      description,
    });

    if (!category) {
      return res.status(400).json({ message: 'Invalid category data' });
    }

    await category.save();

    return res.status(201).json({
      _id: category._id,
      name: category.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const getCategoryById = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    await connectDB();
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = name;
    await category.save();
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    await connectDB();
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const result = await category.remove();

    if (!result) {
      return res.status(400).json({ message: 'Category could not be removed' });
    }

    res.json({ message: 'Category removed' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});

export {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
