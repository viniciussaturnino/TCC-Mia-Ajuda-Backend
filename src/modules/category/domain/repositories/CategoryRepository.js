const BaseRepository = require("../../../main/domain/repositories/BaseRepository");
const CategorySchema = require("../../infra/models/CategoryModel");

class CategoryRepository extends BaseRepository {
  constructor() {
    super(CategorySchema);
  }

  async getById(id) {
    const result = await super.$getById(id);
    return result;
  }

  async list() {
    const result = await super.$get();
    return result;
  }
}

module.exports = CategoryRepository;
