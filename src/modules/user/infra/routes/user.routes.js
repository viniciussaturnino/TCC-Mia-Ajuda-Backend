const express = require("express");
const UserController = require("../controllers/UserController");
const verifyToken = require("../../../main/middlewares/authMiddleware");

const router = express.Router();
const userController = new UserController();

// Public endpoints

router.post("/user", async (req, res, next) => {
  userController.createUser(req, res, next);
});

router.post("/user/login", async (req, res, next) => {
  userController.login(req, res, next);
});

// Private endpoints

router.get("/user", verifyToken, async (req, res, next) => {
  if (req.query.email) {
    userController.getUserByEmail(req, res, next);
  } else {
    userController.getUsers(req, res, next);
  }
});

router.get("/user/:id", verifyToken, async (req, res, next) => {
  userController.getUserById(req, res, next);
});

router.put("/user/:id", verifyToken, async (req, res, next) => {
  userController.updateUserById(req, res, next);
});

router.put("/user/:id/address", verifyToken, async (req, res, next) => {
  userController.updateUserAddressById(req, res, next);
});

router.put("/user/:id/location", verifyToken, async (req, res, next) => {
  userController.updateUserLocationById(req, res, next);
});

module.exports = router;
