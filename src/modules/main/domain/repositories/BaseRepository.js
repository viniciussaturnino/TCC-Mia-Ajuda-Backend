const mongoose = require("mongoose");

class BaseRepository {
  constructor(modelClass) {
    this.ModelClass = modelClass;
  }

  async $save(dataModel, mongoSession = {}) {
    if (dataModel._id) {
      dataModel.lastUpdateDate = Date.now();
    }
    const savedModel = await new this.ModelClass(dataModel).save({
      session: mongoSession.session,
    });
    return savedModel;
  }

  async $get() {
    const result = await this.ModelClass.find();
    return result;
  }

  async $populateExistingDoc(doc, populate) {
    const populatedDoc = await doc.populate(populate);
    return populatedDoc;
  }

  async $saveMany(itemsModel, mongoSession = {}) {
    itemsModel.forEach((item) => {
      item.lastUpdateDate = Date.now();
    });
    const savedModels = await this.ModelClass.insertMany(itemsModel, {
      session: mongoSession.session,
    });
    return savedModels;
  }

  async $update(dataModel, mongoSession = {}) {
    dataModel.lastUpdateDate = Date.now();
    const savedModel = await dataModel.save({ session: mongoSession.session });
    return savedModel;
  }

  async $listAggregate(aggregationPipeline) {
    const aggregatedPipeline =
      await this.ModelClass.aggregate(aggregationPipeline).exec();
    return aggregatedPipeline;
  }

  /**
   * @param {string} id Id do objeto
   * @param {Boolean} [active = true] se vou pegar ou não elementos deletados,
   * Se for false, mesmo elementos removidos serão exibidos.
   */
  async $getById(id, active = true, populate = null) {
    let finalIdFormat = id;

    if (typeof id === "string") {
      try {
        finalIdFormat = new mongoose.Types.ObjectId(id);
      } catch (err) {
        throw new Error("ID is not an ObjectId");
      }
    }

    const query = {
      _id: finalIdFormat,
    };

    if (active) {
      query.active = true;
    }

    const recordModel = await this.ModelClass.findOne(query).populate(populate);

    return recordModel;
  }

  async $list(
    query,
    selectedField = null,
    populate = null,
    sort = null,
    limit = null
  ) {
    return this.ModelClass.find(query, selectedField)
      .populate(populate)
      .sort(sort)
      .limit(limit);
  }

  async $countDocuments(query) {
    const numberDocuments = await this.ModelClass.countDocuments(query);
    return numberDocuments;
  }

  async $findOne(query, projection, populate = null) {
    return this.ModelClass.findOne(query, projection).populate(populate);
  }

  async $destroy(query) {
    const result = await this.ModelClass.deleteOne(query);
    return result;
  }

  async $findOneAndUpdate(filter, update) {
    await this.ModelClass.findOneAndUpdate(filter, update);
  }
}

module.exports = BaseRepository;
