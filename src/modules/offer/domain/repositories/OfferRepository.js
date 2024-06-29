const BaseRepository = require("../../../main/domain/repositories/BaseRepository");
const OfferSchema = require("../../infra/models/OfferModel");

class OfferRepository extends BaseRepository {
  constructor() {
    super(OfferSchema);
  }

  async create(offer) {
    // TDD: to be implemented
    return null;
  }

  async update(offer) {
    // TDD: to be implemented
    return null;
  }

  async getByIdWithAggregation(id) {
    // TDD: to be implemented
    return null;
  }

  async list(userId, categoryArray, getOtherUsers, coords) {
    // TDD: to be implemented
    return null;
  }

  getOfferListQuery(userId, getOtherUsers, categoryArray) {
    // TDD: to be implemented
    return null;
  }

  async listByHelpedUserId(helpedUserId) {
    // TDD: to be implemented
    return null;
  }

  async getById(id) {
    // TDD: to be implemented
    return null;
  }

  async findOne(query, projection, populate = null) {
    // TDD: to be implemented
    return null;
  }

  async finishOffer(offer) {
    // TDD: to be implemented
    return null;
  }
}

module.exports = OfferRepository;
