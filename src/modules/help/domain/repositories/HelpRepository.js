const BaseRepository = require("../../../main/domain/repositories/BaseRepository");
const HelpSchema = require("../../infra/models/HelpModel");

class HelpRepository extends BaseRepository {
  constructor() {
    super(HelpSchema);
  }

  async create(help) {
    // TDD: to be implemented
    return null;
  }

  async get() {
    // TDD: to be implemented
    return null;
  }

  async getById(id) {
    // TDD: to be implemented
    return null;
  }

  async getByUserId(userId) {
    // TDD: to be implemented
    return null;
  }

  async getByIdWithAggregation(id) {
    // TDD: to be implemented
    return null;
  }

  async update(help) {
    // TDD: to be implemented
    return null;
  }

  async getWaitingList(coords, id, categoryArray) {
    // TDD: to be implemented
    return null;
  }

  async countDocuments(id) {
    // TDD: to be implemented
    return null;
  }

  async getHelpListByStatus(userId, statusList) {
    // TDD: to be implemented
    return null;
  }
}

module.exports = HelpRepository;
