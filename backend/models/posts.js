import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tags' }],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    coverImage: { type: String, default: null },
    status: { type: String, enum: ['published', 'draft'], required: true },
    liked: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
