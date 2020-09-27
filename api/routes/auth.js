const router = require("express").Router();
const { isAuth, checkPermission } = require("../../middlewares/auth");
const { login, register, profile } = require("../controllers/auth");
const trimRequest = require("trim-request");

router.post("/register", trimRequest.all, async (req, res) => {
  await register(req.body, res);
});

router.post("/login", trimRequest.all, async (req, res) => {
  await login(req.body, res);
});

router.get("/profile", isAuth, trimRequest.all, async (req, res) => {
  await profile(req.user, res);
});

module.exports = router;
