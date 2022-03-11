import connectDB from '../../../utils/mongodb';
import User from '../../../models/user.js';
import nextConnect from 'next-connect';
import formData from 'express-form-data';
import bodyParser from 'body-parser';

const handler = nextConnect();

handler.use(bodyParser.json());
handler.use(bodyParser.urlencoded());
handler.use(formData.parse());

handler.get(async (req, res) => {
  try {
    const users = await User.find()
      .sort({ email: -1 })
      .populate('avatar')
      .populate('cover');
    const count = await User.countDocuments({});
    res.status(200).json({ count, users });
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
