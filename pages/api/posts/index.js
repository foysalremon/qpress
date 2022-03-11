import connectDB from '../../../utils/mongodb';
import Post from '../../../models/post.js';
import Tag from '../../../models/tag.js';
import Category from '../../../models/category.js';
import nextConnect from 'next-connect';
import formData from 'express-form-data';
import bodyParser from 'body-parser';
import Settings from '../../../models/settings';

const handler = nextConnect();

handler.use(bodyParser.urlencoded());
handler.use(formData.parse());

handler.get(async (req, res) => {
  const { page } = req.query;
  try {
    const settingsArr = await Settings.find();
    const { postPerPage } = settingsArr[0];
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * postPerPage)
      .limit(postPerPage)
      .populate('categories')
      .populate('author')
      .populate('tags');
    const count = await Post.countDocuments({});
    res.status(200).json({ posts, count });
  } catch (error) {
    res.json({ state: 'error', message: error.message });
  }
});

handler.post(async (req, res) => {
  const post = req.body;

  if (!post.slug) {
    post.slug = post.title.replace(/\s+/g, '-').toLowerCase();
  }

  try {
    const newPost = new Post(post);
    await newPost.save();
    newPost.categories.map(async (cat) => {
      await Category.findByIdAndUpdate(
        cat,
        {
          $push: { posts: newPost._id },
        },
        { new: true }
      );
    });
    newPost.tags.map(async (tag) => {
      await Tag.findByIdAndUpdate(
        tag,
        {
          $push: { posts: newPost._id },
        },
        { new: true }
      );
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.json({ state: 'error', message: error.message });
  }
});

export default connectDB(handler);
