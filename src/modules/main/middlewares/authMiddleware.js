const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const UserRepository = require("../../user/domain/repositories/UserRepository");
const { JWT_SECRET } = require("../config/vars");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Auth Token not provided." });
  }

  const token = authHeader.substring(7); // remove Bearer prefix

  try {
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    const userRepository = new UserRepository();
    const user = await userRepository.getById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = verifyToken;
