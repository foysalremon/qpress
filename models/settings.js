import mongoose from 'mongoose';

const settingSchema = mongoose.Schema(
  {
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
    siteTitle: { type: String, default: 'Q Press' },
    siteTagline: {
      type: String,
      default: 'WordPress Clone with React Next.JS, MongoDB...',
    },
    featuredAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dateFormat: { type: String, default: 'MMMM D YYYY' },
    timeFormat: { type: String, default: 'h:mm a' },
    copyright: {
      type: String,
      default:
        'Developed with love by <a href="https://foysalremon.me">Foysal Remon</a>',
    },
    postPerPage: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model('Settings', settingSchema);
