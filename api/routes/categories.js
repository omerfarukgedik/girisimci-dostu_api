const router = require("express").Router();
const { isAuth, checkPermission } = require("../../middlewares/auth");
const {
  categories,
  addCategory,
  delCategory,
  updateCategory,
} = require("../controllers/category");

const trimRequest = require("trim-request");

router.get("/", trimRequest.all, async (req, res) => {
  await categories(req, res);
});

router.post(
  "/",
  isAuth,
  checkPermission(["admin"]),
  trimRequest.all,
  async (req, res) => {
    await addCategory(req.body, res);
  }
);

router.delete(
  "/:id",
  isAuth,
  checkPermission(["admin"]),
  trimRequest.all,
  async (req, res) => {
    await delCategory(req.params.id, res);
  }
);

router.patch(
  "/:id",
  isAuth,
  checkPermission(["admin"]),
  trimRequest.all,
  async (req, res) => {
    await updateCategory(req.params.id, req.body, res);
  }
);

module.exports = router;
