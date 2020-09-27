const User = require("../api/models/User");

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

const serializeUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    _id: user._id,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

module.exports = {
  serializeUser,
  validateEmail,
  validateUsername,
};
