const Product = require("../models/Product");
const { validateCategory, validateProduct } = require("../../utils/db");

const products = async (req, res) => {
  try {
    const data = await Product.find({});
    return res.status(201).json(data);
  } catch (err) {
    return res.status(203).json({
      message: "Unable to access products.",
      success: false,
    });
  }
};

const addProduct = async (product, res) => {
  try {
    const category = await validateCategory(product.category);

    if (!category)
      return res.status(203).json({
        message: "Kategori bulunamadı :(",
        success: false,
      });

    // Create a new product
    const newProduct = new Product(product);
    await newProduct.save();

    // Push product to category
    category.products.push(newProduct);
    await category.save();

    return res.status(201).json({
      message: "Başarılı bir şekilde ürün eklediniz.",
      success: true,
      product: newProduct.name,
    });
  } catch (err) {
    //implement logger function winston
    return res.status(203).json({
      message: "Ürün oluşturulurken hata oluştu. Lütfen tekrar deneyin.",
      success: false,
    });
  }
};

const delProduct = async (productId, res) => {
  try {
    const product = await validateProduct(productId);

    if (!product)
      return res.status(203).json({
        message: "Ürün bulunamadı :(",
        success: false,
      });

    // delete product from category
    const category = await validateCategory(product.category);
    const productIndex = category.products.indexOf(productId);
    category.products.splice(productIndex, 1);
    await category.save();

    // delete product
    await Product.findByIdAndDelete(productId);

    return res.status(201).json({
      message: `${product.name} adlı ürünü başarılı bir şekilde sildiniz.`,
      success: true,
    });
  } catch (err) {
    //implement logger function winston
    return res.status(203).json({
      message: "Ürün silinirken hata oluştu. Lütfen tekrar deneyin.",
      success: false,
    });
  }
};

const updateProduct = async (productId, body, res) => {
  try {
    // Check product
    const prod = await validateProduct(productId);

    if (!prod)
      return res.status(203).json({
        message: "Ürün bulunamadı :(",
        success: false,
      });

    const updatedProd = await Product.findByIdAndUpdate(productId, body, {
      new: true,
      runValidators: true,
    });

    return res.status(201).json({
      message: `Ürünü başarılı bir şekilde güncellediniz.`,
      success: true,
      product: updatedProd,
    });
  } catch (err) {
    //implement logger function winston
    return res.status(203).json({
      message: "Ürün güncellenirken hata oluştu. Lütfen tekrar deneyin.",
      success: false,
    });
  }
};

module.exports = { products, addProduct, delProduct, updateProduct };
