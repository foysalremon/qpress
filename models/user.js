import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is not given. It is required field'],
    },
    email: {
      type: String,
      required: [true, 'Email is not given. It is required field'],
    },
    image: {
      type: String,
      default: '',
    },
    avatar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
    cover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
    emailVerified: {
      type: String,
      default: null,
    },
    profession: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    facebook: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
