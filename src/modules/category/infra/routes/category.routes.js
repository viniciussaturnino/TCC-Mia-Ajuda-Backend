const express = require("express");
const CategoryController = require("../controllers/CategoryController");
const verifyToken = require("../../../main/middlewares/authMiddleware");

const categoryController = new CategoryController();
const routes = express.Router();

routes.get("/category/:id", verifyToken, async (req, res, next) => {
  categoryController.getCategoryById(req, res, next);
});

routes.get("/category", verifyToken, async (req, res, next) => {
  categoryController.getCategoryList(req, res, next);
});

module.exports = routes;
