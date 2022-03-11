import connectDB from '../../../utils/mongodb';
import mongoose from 'mongoose';
import Post from '../../../models/post.js';
import Tag from '../../../models/tag.js';
import Category from '../../../models/category.js';
import nextConnect from 'next-connect';
import formData from 'express-form-data';
import bodyParser from 'body-parser';

const handler = nextConnect();

handler.use(bodyParser.urlencoded());
handler.use(formData.parse());

handler.get(async (req, res) => {
  const { id } = req.query;
  const post = await Post.findById(id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.json({ state: 'error', message: 'No post found' });
  }
});

handler.patch(async (req, res) => {
  const {
    query: { id: _id },
    body,
  } = req;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.json({ state: 'error', message: 'No post found' });
  }

  const previousPost = await Post.findById(_id);
  const updatedPost = await Post.findByIdAndUpdate(_id, body, { new: true });

  if (
    previousPost.categories.sort().toString() !=
    updatedPost.categories.sort().toString()
  ) {
    updatedPost.categories.map(async (cat) => {
      if (!previousPost.categories.includes(cat._id)) {
        await Category.findByIdAndUpdate(
          cat._id,
          {
            $push: { posts: updatedPost._id },
          },
          { new: true }
        );
      }
    });

    previousPost.categories.map(async (cat) => {
      if (!updatedPost.categories.includes(cat._id)) {
        await Category.findByIdAndUpdate(
          cat._id,
          {
            $pull: { posts: updatedPost._id },
          },
          { new: true }
        );
      }
    });
  }

  if (
    previousPost.tags.sort().toString() != updatedPost.tags.sort().toString()
  ) {
    updatedPost.tags.map(async (tag) => {
      if (!previousPost.tags.includes(tag._id)) {
        await Tag.findByIdAndUpdate(
          tag._id,
          {
            $push: { posts: updatedPost._id },
          },
          { new: true }
        );
      }
    });

    previousPost.tags.map(async (tag) => {
      if (!updatedPost.tags.includes(tag._id)) {
        await Tag.findByIdAndUpdate(
          tag._id,
          {
            $pull: { posts: updatedPost._id },
          },
          { new: true }
        );
      }
    });
  }

  res.json(updatedPost);
});

export default connectDB(handler);
