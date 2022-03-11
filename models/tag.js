import mongoose from 'mongoose';

const tagSchema = mongoose.Schema(
  {
    name: { type: String, requied: [true, 'Name is required'] },
    slug: { type: String, requied: [true, 'Slug is required'] },
    description: String,
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Tag || mongoose.model('Tag', tagSchema);
