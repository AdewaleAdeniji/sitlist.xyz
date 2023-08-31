require("dotenv").config();

exports.config = {
  USER_SERVICE_URL: process.env.USER_SERVICE_URL,
  USER_SERVICE_API_KEY: process.env.USER_SERVICE_API_KEY,
  LOG_KEY: process.env.LOG_KEY,
  API_KEYS_SALT: process.env.API_KEYS_SALT,
};
exports.algorithm = 'aes-256-ctr';