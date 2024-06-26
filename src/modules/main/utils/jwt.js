const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/vars");

const generateAuthToken = (user) => {
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = {
  generateAuthToken,
};
