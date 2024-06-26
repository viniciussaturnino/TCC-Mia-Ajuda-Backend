/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
  example: path.join(__dirname, "../../.env.example"),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  API_PORT: process.env.API_PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PASSWORD_SALT: process.env.PASSWORD_SALT,
};
