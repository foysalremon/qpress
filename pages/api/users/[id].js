import connectDB from '../../../utils/mongodb';
import User from '../../../models/user.js';
import nextConnect from 'next-connect';
import formData from 'express-form-data';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const handler = nextConnect();

handler.use(bodyParser.json());
handler.use(bodyParser.urlencoded());
handler.use(formData.parse());

handler.get(async (req, res) => {
  const { id } = req.query;
  const user = await User.findById(id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.json({ state: 'error', message: 'No media found' });
  }
});

handler.patch(async (req, res) => {
  const { id } = req.query;
  const data = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.json({ state: 'error', message: 'No user found' });

  const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
  res.status(201).json(updatedUser);
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default connectDB(handler);
