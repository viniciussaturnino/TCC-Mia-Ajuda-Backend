const CategoryService = require("../../app/CategoryService");

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  async getCategoryById(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async getCategoryList(req, res, next) {
    // TDD: to be implemented
    return null;
  }
}

module.exports = CategoryController;
