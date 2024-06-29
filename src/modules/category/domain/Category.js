const CategoryRepository = require("../domain/repositories/CategoryRepository");

class Category {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }
}

module.exports = Category;
