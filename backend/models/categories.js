import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categories',
      default: null,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
