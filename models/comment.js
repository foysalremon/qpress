import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    content: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    featuredImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Comment ||
  mongoose.model('Comment', commentSchema);
