const mongoose = require("mongoose");

class BaseRepository {
  constructor(modelClass) {
    this.ModelClass = modelClass;
  }

  async $save(dataModel, mongoSession = {}) {
    // TDD: to be implemented.
    return null;
  }

  async $get() {
    // TDD: to be implemented.
    return null;
  }

  async $populateExistingDoc(doc, populate) {
    // TDD: to be implemented.
    return null;
  }

  async $saveMany(itemsModel, mongoSession = {}) {
    // TDD: to be implemented.
    return null;
  }

  async $update(dataModel, mongoSession = {}) {
    // TDD: to be implemented.
    return null;
  }

  async $listAggregate(aggregationPipeline) {
    // TDD: to be implemented.
    return null;
  }

  async $getById(id, active = true, populate = null) {
    // TDD: to be implemented.
    return null;
  }

  async $list(
    query,
    selectedField = null,
    populate = null,
    sort = null,
    limit = null
  ) {
    // TDD: to be implemented.
    return null;
  }

  async $countDocuments(query) {
    // TDD: to be implemented.
    return null;
  }

  async $findOne(query, projection, populate = null) {
    // TDD: to be implemented.
    return null;
  }

  async $destroy(query) {
    // TDD: to be implemented.
    return null;
  }

  async $findOneAndUpdate(filter, update) {
    // TDD: to be implemented.
    return null;
  }
}

module.exports = BaseRepository;
