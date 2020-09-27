const { validateProduct, validateUser } = require("../../utils/db");

const myBasket = async (userId, res) => {
  try {
    const user = await validateUser(userId);
    return res.status(201).json(user.basket);
  } catch (err) {
    return res.status(203).json({
      message: "Sepete erişirken hata oluştu. Lütfen tekrar deneyin.",
      success: false,
    });
  }
};

const addProduct = async (productId, userId, res) => {
  try {
    const product = await validateProduct(productId);
    const user = await validateUser(userId);

    user.basket.push(product);
    await user.save();

    return res.status(201).json({
      message: `${product.name} adlı ürün sepetinize eklendi.`,
      success: true,
      product: product.name,
    });
  } catch (err) {
    return res.status(203).json({
      message: "Sepete ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.",
      success: false,
    });
  }
};

const delProduct = async (productId, userId, res) => {
  try {
    const product = await validateProduct(productId);
    const user = await validateUser(userId);

    const getIndex = user.basket.indexOf(productId);
    user.basket.splice(getIndex, 1);
    await user.save();

    return res.status(201).json({
      message: `${product.name} adlı ürün sepetinizden çıkarıldı.`,
      success: true,
    });
  } catch (err) {
    return res.status(203).json({
      message: "Sepetten ürün çıkarılırken hata oluştu. Lütfen tekrar deneyin.",
      success: false,
    });
  }
};

module.exports = { myBasket, addProduct, delProduct };
