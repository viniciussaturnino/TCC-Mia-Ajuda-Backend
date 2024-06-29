const BaseRepository = require("../../../main/domain/repositories/BaseRepository");
const OfferSchema = require("../../infra/models/OfferModel");
const { getLocation } = require("../../../main/utils/location");

class OfferRepository extends BaseRepository {
  constructor() {
    super(OfferSchema);
  }

  async create(offer) {
    const newOffer = await super.$save(offer);
    return newOffer;
  }

  async update(offer) {
    await super.$update(offer);
  }

  async getByIdWithAggregation(id) {
    const commomUserFields = [
      "_id",
      "name",
      "photo",
      "birthday",
      "phone",
      "address.city",
      "address.state",
    ];
    const query = { _id: id };
    const offerFields = [
      "_id",
      "description",
      "title",
      "status",
      "ownerId",
      "categoryId",
      "possibleHelpedUsers",
      "helpedUserId",
      "creationDate",
      "location",
    ];

    const userInfo = {
      user: null,
      possibleHelpedUsers: null,
      helpedUsers: null,
    };

    Object.keys(userInfo).forEach((key) => {
      userInfo[key] = {
        path: key,
        select: commomUserFields,
      };
    });

    const categories = {
      path: "categories",
      select: ["_id", "name"],
    };

    const populate = [
      userInfo.user,
      categories,
      userInfo.possibleHelpedUsers,
      userInfo.helpedUsers,
    ];
    return super.$findOne(query, offerFields, populate);
  }

  async list(userId, categoryArray, getOtherUsers, coords) {
    const matchQuery = this.getOfferListQuery(
      userId,
      getOtherUsers,
      categoryArray
    );

    const offerFields = [
      "_id",
      "title",
      "categoryId",
      "ownerId",
      "helpedUserId",
      "creationDate",
      "location",
      "description",
    ];
    const sort = { creationDate: -1 };
    const user = {
      path: "user",
      select: ["name", "address", "birthday", "location.coordinates"],
    };

    const categories = "categories";

    const possibleHelpedUsers = {
      path: "possibleHelpedUsers",
      select: ["_id", "name"],
    };

    const populate = [user, categories, possibleHelpedUsers];

    const offers = await super.$list(matchQuery, offerFields, populate, sort);

    if (coords) {
      const offersWithDistances = offers.map((offer) => {
        const offerLocation = getLocation(offer);
        offer.distances = { userCoords: offerLocation, coords };
        return offer.toObject();
      });

      offersWithDistances.sort((a, b) => a.distanceValue - b.distanceValue);

      return offersWithDistances;
    }
    return offers;
  }

  getOfferListQuery(userId, getOtherUsers, categoryArray) {
    const matchQuery = { active: true };
    if (!getOtherUsers) {
      matchQuery.ownerId = { $ne: userId };

      matchQuery.possibleHelpedUsers = { $nin: [userId] };
    } else {
      matchQuery.ownerId = { $eq: userId };
    }

    if (categoryArray) {
      matchQuery.categoryId = {
        $in: categoryArray.map((category) => category),
      };
    }
    return matchQuery;
  }

  async listByHelpedUserId(helpedUserId) {
    const query = { helpedUserId };
    const helpOffers = await super.$list(query);
    return helpOffers;
  }

  async getById(id) {
    const offer = await super.$getById(id);
    return offer;
  }

  async findOne(query, projection, populate = null) {
    return super.$findOne(query, projection, populate);
  }

  async finishOffer(offer) {
    offer.active = false;
    return super.$update(offer);
  }
}

module.exports = OfferRepository;
