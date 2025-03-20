const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const response = await product.save();
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  try {
    let admin = req.query.admin;
    let query;
    let totalItems;

    if (admin) {
      query = Product.find({});
      totalItems = Product.find({});
    } else {
      query = Product.find({ deleted: { $ne: true } });
      totalItems = Product.find({ deleted: { $ne: true } });
    }
    if (req.query.category) {
      query = query.find({ category: [req.query.category] });
      totalItems = totalItems.find({ category: [req.query.category] });
    }
    if (req.query.brand) {
      query = query.find({ brand: [req.query.brand] });
      totalItems = totalItems.find({ brand: [req.query.brand] });
    }
    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
      totalItems = totalItems.sort({ [req.query._sort]: req.query._order });
    }

    if (req.query._page && req.query._limit) {
      const pageSize = req.query._limit;
      const page = req.query._page;
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    const docs = await query.exec();
    const total = await totalItems.count().exec();
    console.log(total);
    res.set("X-Total-Count", total);
    res.status(201).json(docs);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
exports.fetchProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};
