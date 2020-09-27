require("dotenv").config();

module.exports = {
  DB: process.env.APP_DB,
  PORT: process.env.APP_PORT,
  SECRET: process.env.APP_SECRET,
  EXPIRES: process.env.JWT_EXPIRATION_IN_MINUTES,
  FRONTEND_URL: process.env.FRONTEND_URL,
};
