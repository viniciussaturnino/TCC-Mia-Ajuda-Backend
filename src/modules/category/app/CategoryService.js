const Category = require("../domain/Category");

class CategoryService {
  constructor() {
    const category = new Category();
    this.categoryRepository = category.categoryRepository;
  }

  async getCategoryById(id) {
    const Category = await this.categoryRepository.getById(id);

    if (!Category) {
      throw new Error("Category not found");
    }

    return Category;
  }

  async getCategoryList() {
    const Categorylist = await this.categoryRepository.list();
    if (!Categorylist) {
      throw new Error("Category not found");
    }

    return Categorylist;
  }
}

module.exports = CategoryService;
