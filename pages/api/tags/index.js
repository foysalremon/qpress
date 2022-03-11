import connectDB from '../../../utils/mongodb';
import Tag from '../../../models/tag.js';
import nextConnect from 'next-connect';
import formData from 'express-form-data';
import bodyParser from 'body-parser';

const handler = nextConnect();

handler.use(bodyParser.urlencoded());
handler.use(formData.parse());

handler.get(async (req, res) => {
  try {
    const tags = await Tag.find().sort({ createAt: -1 });
    const count = await Tag.countDocuments({});
    res.status(200).json({ count, tags });
  } catch (error) {
    res.json({ state: 'error', message: error.message });
  }
});

handler.post(async (req, res) => {
  const tag = req.body;

  if (!tag.slug) {
    tag.slug = tag.name.replace(/\s+/g, '-').toLowerCase();
  }

  try {
    const newTag = new Tag(tag);
    await newTag.save();
    res.status(201).json(newTag);
  } catch (error) {
    res.json({ state: 'error', message: error.message });
  }
});

export default connectDB(handler);
