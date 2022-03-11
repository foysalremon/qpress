import connectDB from '../../../utils/mongodb';
import cloudinary from 'cloudinary';
import Settings from '../../../models/settings.js';
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

handler.get(async (req, res) => {
  try {
    let settings = null;
    const settingsArr = await Settings.find();
    if (settingsArr.length > 0) {
      settings = settingsArr[0];
    } else {
      const defaultSettings = { featuredAuthor: null };
      const settings = new Settings(defaultSettings);
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (error) {
    res.json({ state: 'error', message: error.message });
  }
});

handler.patch(async (req, res) => {
  const setting = req.body;
  const updateSettings = await Settings.findByIdAndUpdate(
    setting._id,
    setting,
    { new: true }
  );
  res.status(201).json(updateSettings);
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default connectDB(handler);
