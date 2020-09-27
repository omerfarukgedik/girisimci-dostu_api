const router = require("express").Router();
const { isAuth, checkPermission } = require("../../middlewares/auth");
const { users, addUser, delUser, updateUser } = require("../controllers/user");
const trimRequest = require("trim-request");

router.get(
  "/",
  isAuth,
  checkPermission(["admin"]),
  trimRequest.all,
  async (req, res) => {
    await users(req, res);
  }
);

router.post(
  "/",
  isAuth,
  checkPermission(["admin"]),
  trimRequest.all,
  async (req, res) => {
    await addUser(req.body, res);
  }
);

router.delete(
  "/:id",
  isAuth,
  checkPermission(["admin"]),
  trimRequest.all,
  async (req, res) => {
    await delUser(req.params.id, res);
  }
);

router.patch(
  "/:id",
  isAuth,
  checkPermission(["admin"]),
  trimRequest.all,
  async (req, res) => {
    if (!req.body.name)
      return res.status(203).json({
        message: `You can change only your name`,
        success: false,
      });

    await updateUser(req.params.id, req.body.name, res);
  }
);

module.exports = router;
