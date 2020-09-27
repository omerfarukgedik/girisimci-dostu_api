const router = require("express").Router();
const { isAuth, checkPermission } = require("../../middlewares/auth");
const {
  products,
  addProduct,
  delProduct,
  updateProduct,
} = require("../controllers/product");

const trimRequest = require("trim-request");

router.get("/", trimRequest.all, async (req, res) => {
  await products(req, res);
});

router.post(
  "/",
  isAuth,
  checkPermission(["client", "admin"]),
  trimRequest.all,
  async (req, res) => {
    await addProduct(req.body, res);
  }
);

router.delete(
  "/:id",
  isAuth,
  checkPermission(["admin"]),
  trimRequest.all,
  async (req, res) => {
    await delProduct(req.params.id, res);
  }
);

router.patch(
  "/:id",
  isAuth,
  checkPermission(["admin"]),
  trimRequest.all,
  async (req, res) => {
    await updateProduct(req.params.id, req.body, res);
  }
);

module.exports = router;
