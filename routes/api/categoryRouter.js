const express = require('express');
const ProductCategories = require('../../models/categories');

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res, next) => {
  const result = await ProductCategories.find();
  res.status(200).json({ result });
});

module.exports = categoriesRouter;
