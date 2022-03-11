import connectDB from '../../../utils/mongodb';
import mongoose from 'mongoose';
import Post from '../../../models/post.js';
import Tag from '../../../models/tag.js';
import nextConnect from 'next-connect';
import formData from 'express-form-data';
import bodyParser from 'body-parser';

const handler = nextConnect();

handler.use(bodyParser.urlencoded());
handler.use(formData.parse());

handler.get(async (req, res) => {
  const { id } = req.query;
  const cat = await Tag.findById(id);
  if (cat) {
    res.status(200).json(cat);
  } else {
    res.json({ state: 'error', message: 'No tag found' });
  }
});

handler.patch(async (req, res) => {
  const {
    query: { id: _id },
    body,
  } = req;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.json({ state: 'error', message: 'No tag found' });
  }

  try {
    const updatedCat = await Tag.findByIdAndUpdate(_id, body, {
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
    return res.json({ status: 'error', message: 'No tag with that id' });
  try {
    const posts = await Post.find({ tags: id });
    posts.map((post) => post.tags.remove(id));
    await Tag.findByIdAndDelete(id);
    res.json({ state: 'success', message: 'Tag deleted successfully' });
  } catch (error) {
    res.json({ state: 'error', message: error.message });
  }
});

export default connectDB(handler);
