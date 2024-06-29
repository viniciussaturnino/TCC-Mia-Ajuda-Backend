const CategoryService = require("../../app/CategoryService");

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  async getCategoryById(req, res, next) {
    const { id } = req.params;

    try {
      const result = await this.categoryService.getCategoryById(id);
      res.status(200).json(result);
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getCategoryList(req, res, next) {
    try {
      const result = await this.categoryService.getCategoryList();
      res.status(200).json(result);
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }
}

module.exports = CategoryController;
