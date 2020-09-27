const passport = require("passport");

const isAuth = passport.authenticate("jwt", { session: false });

const checkPermission = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(203).json({
        message: "Burayı görebilmek için yetkiniz bulunmamakta.",
        success: false,
      })
    : next();

module.exports = { isAuth, checkPermission };
