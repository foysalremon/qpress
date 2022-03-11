import connectDB from '../../../utils/mongodb';
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

handler.use(bodyParser.json());
handler.use(bodyParser.urlencoded());
handler.use(formData.parse());

handler.post(async (req, res) => {
  const values = Object.values(req.files);
  const image = values[0];

  cloudinary.v2.uploader.upload(
    image.path,
    {
      folder: 'q_press',
      eager: [
        { width: 184, height: 184, crop: 'thumb' },
        { width: 790, height: 444, crop: 'thumb' },
      ],
    },
    async (err, img) => {
      if (err) {
        res.json({ status: 'error', message: err.message });
        return;
      }

      let timeId = image.fieldName;
      const { public_id, url, eager } = img;
      const { url: thumb } = eager[0];
      const { url: post } = eager[1];
      let media = { timeId, public_id, url, thumb, post };
      const newMedia = new Media(media);
      try {
        await newMedia.save();
        res.status(201).json(newMedia);
      } catch (error) {
        res.json({ status: 'error', message: error.message });
      }
    }
  );
});

handler.get(async (req, res) => {
  try {
    const medias = await Media.find().sort({ createdAt: -1 });
    const count = await Media.countDocuments({});
    res.status(200).json({ count, medias });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default connectDB(handler);
