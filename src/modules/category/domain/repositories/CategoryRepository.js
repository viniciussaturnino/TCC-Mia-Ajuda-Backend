const BaseRepository = require("../../../main/domain/repositories/BaseRepository");
const CategorySchema = require("../../infra/models/CategoryModel");

class CategoryRepository extends BaseRepository {
  constructor() {
    super(CategorySchema);
  }

  async getById(id) {
    // TDD: to be implemented
    return null;
  }

  async list() {
    // TDD: to be implemented
    return null;
  }
}

module.exports = CategoryRepository;
