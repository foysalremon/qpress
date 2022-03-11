import connectDB from '../../../utils/mongodb';
import mongoose from 'mongoose';
import Post from '../../../models/post.js';
import Category from '../../../models/category.js';
import nextConnect from 'next-connect';
import formData from 'express-form-data';
import bodyParser from 'body-parser';

const handler = nextConnect();

handler.use(bodyParser.urlencoded());
handler.use(formData.parse());

handler.get(async (req, res) => {
  const { id } = req.query;
  const cat = await Category.findById(id);
  if (cat) {
    res.status(200).json(cat);
  } else {
    res.json({ state: 'error', message: 'No category found' });
  }
});

handler.patch(async (req, res) => {
  const {
    query: { id: _id },
    body,
  } = req;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.json({ state: 'error', message: 'No category found' });
  }

  try {
    const updatedCat = await Category.findByIdAndUpdate(_id, body, {
      new: true,
    });
    res.json(updatedCat);
  } catch (error) {
    res.json({ state: 'error', message: error.message });
  }
});

handler.delete(async (req, res) => {
  const { id } = req.query;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.json({ status: 'error', message: 'No category with that id' });
  try {
    const posts = await Post.find({ categories: id });
    posts.map((post) => post.categories.remove(id));
    await Category.findByIdAndDelete(id);
    res.json({ state: 'success', message: 'Category deleted successfully' });
  } catch (error) {
    res.json({ state: 'error', message: error.message });
  }
});

export default connectDB(handler);
