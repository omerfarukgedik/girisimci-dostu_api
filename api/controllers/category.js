const Category = require("../models/Category");
const Product = require("../models/Product");
const { validateCategory } = require("../../utils/db");

const categories = async (req, res) => {
  try {
    const data = await Category.find({}).populate("product");
    return res.status(201).json(data);
  } catch (err) {
    return res.status(203).json({
      message: "Unable to access categories.",
      success: false,
    });
  }
};

const addCategory = async (category, res) => {
  try {
    const newCategory = new Category(category);
    await newCategory.save();

    return res.status(201).json({
      message: "Başarılı bir şekilde kategori oluşturdunuz.",
      success: true,
      category: newCategory.name,
    });
  } catch (err) {
    return res.status(203).json({
      message: "Kategori oluşturulurken hata oluştu. Lütfen tekrar deneyin.",
      success: false,
    });
  }
};

const delCategory = async (catId, res) => {
  try {
    const cat = await validateCategory(catId);
    if (!cat)
      return res.status(203).json({
        message: "Kategori bulunamadı :(",
        success: false,
      });

    const products = await Product.find({
      category: catId,
    });

    products.forEach(async (product) => {
      await Product.findByIdAndDelete(product._id);
    });

    await Category.findByIdAndDelete(catId);

    return res.status(201).json({
      message: `Başarılı bir şekilde '${cat.name}' kategorisini ve ona ait olan '${products.length}' ürünü sildiniz.`,
      success: true,
    });
  } catch (err) {
    return res.status(203).json({
      message: "Kategori silinirken hata oluştu. Lütfen tekrar deneyin.",
      success: false,
    });
  }
};

const updateCategory = async (catId, body, res) => {
  try {
    const cat = await validateCategory(catId);

    if (!cat)
      return res.status(203).json({
        message: "Kategori bulunamadı :(",
        success: false,
      });

    const updatedCat = await Category.findByIdAndUpdate(catId, body, {
      new: true,
      runValidators: true,
    });

    return res.status(201).json({
      message: `${cat.name} kategorisini ${updatedCat.name} olarak değiştirdiniz.`,
      success: true,
    });
  } catch (err) {
    return res.status(203).json({
      message: "Kategori güncellenirken hata oluştu. Lütfen tekrar deneyin.",
      success: false,
    });
  }
};

module.exports = { categories, addCategory, delCategory, updateCategory };
