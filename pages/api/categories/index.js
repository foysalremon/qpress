import connectDB from '../../../utils/mongodb';
import Category from '../../../models/category.js';
import nextConnect from 'next-connect';
import formData from 'express-form-data';
import bodyParser from 'body-parser';

const handler = nextConnect();

handler.use(bodyParser.urlencoded());
handler.use(formData.parse());

handler.get(async (req, res) => {
  try {
    const categories = await Category.find().sort({ createAt: -1 });
    const count = await Category.countDocuments({});
    res.status(200).json({ count, categories });
  } catch (error) {
    res.json({ state: 'error', message: error.message });
  }
});

handler.post(async (req, res) => {
  const cat = req.body;

  if (!cat.slug) {
    cat.slug = cat.name.replace(/\s+/g, '-').toLowerCase();
  }

  try {
    const newCategory = new Category(cat);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.json({ state: 'error', message: error.message });
  }
});

export default connectDB(handler);
