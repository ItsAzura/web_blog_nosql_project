import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, enum: ['admin', 'user'], required: true },
    description: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Role = mongoose.model('Role', roleSchema);

export default Role;
