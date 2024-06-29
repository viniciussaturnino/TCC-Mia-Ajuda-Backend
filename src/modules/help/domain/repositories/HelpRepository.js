const BaseRepository = require("../../../main/domain/repositories/BaseRepository");
const HelpSchema = require("../../infra/models/HelpModel");
const helpStatusEnum = require("../../infra/enums/helpStatusEnum");
const { getLocation } = require("../../../main/utils/location");

class HelpRepository extends BaseRepository {
  constructor() {
    super(HelpSchema);
  }

  async create(help) {
    const doc = await super.$save(help);
    const populate = [
      {
        path: "user",
        select: ["name", "riskGroup"],
      },
      {
        path: "categories",
        select: ["name"],
      },
    ];
    const result = await super.$save(doc, populate);
    return {
      _id: result._id,
      ownerId: result.ownerId,
      title: result.title,
      categoryId: result.categoryId,
      categories: result.categories,
      user: result.user,
      location: result.location,
    };
  }

  async get() {
    const result = await super.$get();
    return result;
  }

  async getById(id, getAggregation = false) {
    const help = await super.$getById(id);
    return help;
  }

  async getByUserId(userId) {
    const matchQuery = { ownerId: userId, active: true };

    return super.$list(matchQuery);
  }

  async getByIdWithAggregation(id) {
    const matchQuery = { _id: id };
    const helpFields = [
      "_id",
      "ownerId",
      "categoryId",
      "description",
      "helperId",
      "status",
      "title",
      "location",
      "creationDate",
    ];
    const user = {
      path: "user",
      select: [
        "photo",
        "name",
        "phone",
        "birthday",
        "address.city",
        "location.coordinates",
      ],
    };
    const categories = {
      path: "categories",
      select: ["_id", "name"],
    };

    return super.$findOne(matchQuery, helpFields, [user, categories]);
  }

  async update(help) {
    await super.$update(help);
  }

  async getWaitingList(coords, id, categoryArray) {
    const matchQuery = {
      active: true,
      ownerId: id,
      status: helpStatusEnum.WAITING,
    };

    if (categoryArray) {
      matchQuery.categoryId = {
        $in: categoryArray.map((categoryString) => categoryString),
      };
    }
    const helpFields = [
      "_id",
      "title",
      "description",
      "categoryId",
      "ownerId",
      "creationDate",
      "location",
    ];
    const user = {
      path: "user",
      select: ["name", "riskGroup", "location.coordinates"],
    };
    const categories = {
      path: "categories",
      select: ["_id", "name"],
    };
    const helps = await super.$list(matchQuery, helpFields, [user, categories]);

    const helpsWithDistance = helps.map((help) => {
      const helpLocation = getLocation(help);
      help.distances = { userCoords: helpLocation, coords };
      return help.toObject();
    });

    helpsWithDistance.sort((a, b) => a.distanceValue - b.distanceValue);

    return helpsWithDistance;
  }

  async countDocuments(id) {
    const query = {};
    query.ownerId = id;
    query.active = true;
    query.status = { $ne: helpStatusEnum.FINISHED };
    const result = await super.$countDocuments(query);

    return result;
  }

  async listToExpire() {
    const date = new Date();
    date.setDate(date.getDate() - 14);

    return super.$list({
      creationDate: { $lt: new Date(date) },
      active: true,
    });
  }

  async getHelpListByStatus(userId, statusList) {
    const matchQuery = {
      status: {
        $in: [...statusList],
      },
      active: true,
    };

    const fields = [
      "_id",
      "description",
      "title",
      "status",
      "ownerId",
      "categoryId",
      "creationDate",
    ];

    const user = {
      path: "user",
      select: ["photo", "phone", "name", "birthday", "address.city"],
    };

    const categories = {
      path: "categories",
      select: ["_id", "name"],
    };

    const populate = [user, categories];

    matchQuery.ownerId = userId;

    const helpList = await super.$list(matchQuery, fields, populate);
    return helpList;
  }
}

module.exports = HelpRepository;
