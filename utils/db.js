const Category = require("../api/models/Category");
const Product = require("../api/models/Product");
const User = require("../api/models/User");

const validateCategory = async (catId) => {
  let cat = await Category.findById(catId);
  return cat ? cat : false;
};

const validateProduct = async (productId) => {
  let p = await Product.findById(productId);
  return p ? p : false;
};

const validateUser = async (userId) => {
  let u = await User.findById(userId);
  return u ? u : false;
};

module.exports = {
  validateCategory,
  validateProduct,
  validateUser,
};
