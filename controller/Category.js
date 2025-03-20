const { Category } = require("../model/Category");

exports.fetchCategory = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const response = await category.save();
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
