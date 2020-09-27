const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  validateEmail,
  validateUsername,
  serializeUser,
} = require("../../utils/auth");
const { SECRET, EXPIRES } = require("../../config");

const expiresIn = Math.floor(Date.now() / 1000) + 60 * EXPIRES;

const register = async (userDets, res) => {
  try {
    let usernameTaken = await validateUsername(userDets.username);
    if (!usernameTaken) {
      return res.status(203).json({
        message: `Kullanıcı adı zaten alınmış.`,
        success: false,
      });
    }

    let emailRegistered = await validateEmail(userDets.email);
    if (!emailRegistered) {
      return res.status(203).json({
        message: `Bu e-posta adresi ile kayıt olunmuş.`,
        success: false,
      });
    }

    const password = await bcrypt.hash(userDets.password, 12);

    const newUser = new User({
      ...userDets,
      password,
      role: "user",
    });

    await newUser.save();
    return res.status(201).json({
      message: "Başarılı bir şekilde kayıt oldunuz.",
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(203).json({
      message: "Sistemde bir hata meydana geldi. Daha sonra tekrar deneyin.",
      success: false,
    });
  }
};

const login = async (userCreds, res) => {
  let { username, password } = userCreds;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(203).json({
      message: "Giriş bilgileri hatalı. Lütfen tekrar deneyin.",
      success: false,
    });
  }

  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(203).json({
      message: "Giriş bilgileri hatalı. Lütfen tekrar deneyin.",
      success: false,
    });

  let token = jwt.sign({ user_id: user._id }, SECRET, {
    expiresIn: expiresIn,
  });

  let result = {
    username: user.username,
    role: user.role,
    email: user.email,
  };

  return res.status(200).json({
    message: "Başarılı bir şekilde giriş yaptınız.",
    success: true,
    token,
    user: result,
  });
};

const profile = async (user, res) => {
  return res.json(serializeUser(user));
};

module.exports = {
  login,
  register,
  profile,
};
