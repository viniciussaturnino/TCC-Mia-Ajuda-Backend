const Category = require("../domain/Category");

class CategoryService {
  constructor() {
    const category = new Category();
    this.categoryRepository = category.categoryRepository;
  }

  async getCategoryById(id) {
    // TDD: to be implemented
    return null;
  }

  async getCategoryList() {
    // TDD: to be implemented
    return null;
  }
}

module.exports = CategoryService;
