import connectDB from '../../../utils/mongodb';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import Media from '../../../models/media.js';
import nextConnect from 'next-connect';
import formData from 'express-form-data';
import bodyParser from 'body-parser';

cloudinary.config({
  cloud_name: process.env.IMG_API_NAME,
  api_key: process.env.IMG_API_KEY,
  api_secret: process.env.IMG_API_SECRET,
});

const handler = nextConnect();

handler.use(bodyParser.urlencoded());
handler.use(formData.parse());

handler.get(async (req, res) => {
  const { id } = req.query;
  const media = await Media.findById(id);
  if (media) {
    res.status(200).json(media);
  } else {
    res.json({ state: 'error', message: 'No media found' });
  }
});

handler.patch(async (req, res) => {
  const {
    query: { id: _id },
    body,
  } = req;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.json({ state: 'error', message: 'No media found' });
  }

  try {
    const updateMedia = await Media.findByIdAndUpdate(_id, body, { new: true });
    res.status(201).json(updateMedia);
  } catch (error) {
    res.json({ state: 'error', message: error.message });
  }
});

handler.delete(async (req, res) => {
  const { id } = req.query;
  const media = await Media.findById(id);

  if (media) {
    try {
      cloudinary.v2.api.delete_resources(
        [media.public_id],
        async (err, result) => {
          if (err) {
            res.json({
              state: 'error',
              message: 'Deleting media failed. Try again.',
            });
          }

          await Media.findByIdAndDelete(id);
          res.json({
            state: 'success',
            message: 'Media deleted successfully',
          });
        }
      );
    } catch (error) {
      res.json({ state: 'error', message: error.message });
    }
  } else {
    res.json({ state: 'error', message: 'No media with this id' });
  }
});

export default connectDB(handler);
