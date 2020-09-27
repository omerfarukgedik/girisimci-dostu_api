const router = require("express").Router();
const { isAuth } = require("../../middlewares/auth");
const { myBasket, addProduct, delProduct } = require("../controllers/basket");

const trimRequest = require("trim-request");

router.get("/", isAuth, trimRequest.all, async (req, res) => {
  await myBasket(req.user.id, res);
});

router.post("/:id", isAuth, trimRequest.all, async (req, res) => {
  await addProduct(req.params.id, req.user.id, res);
});

router.delete("/:id", isAuth, trimRequest.all, async (req, res) => {
  await delProduct(req.params.id, req.user.id, res);
});

module.exports = router;
