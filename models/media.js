import mongoose from 'mongoose';

const mediaSchema = mongoose.Schema(
  {
    timeId: { type: String, required: true },
    public_id: { type: String, required: true },
    thumb: { type: String },
    post: { type: String },
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    caption: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model('Media', mediaSchema);
