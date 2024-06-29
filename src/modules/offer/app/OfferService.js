const Offer = require("../domain/Offer");
const Help = require("../../help/domain/Help");
const User = require("../../user/domain/User");

class OfferService {
  constructor() {
    const offer = new Offer();
    const help = new Help();
    const user = new User();
    this.offerRepository = offer.offerRepository;
    this.helpRepository = help.helpRepository;
    this.userRepository = user.userRepository;
  }

  async createOffer(data) {
    const newOffer = await this.offerRepository.create(data);
    return newOffer;
  }

  async getOfferWithAggregationById(id) {
    const offer = await this.offerRepository.getByIdWithAggregation(id);

    if (!offer) {
      throw new Error("Offer not found");
    }

    return offer;
  }

  async listOffers(userId, getOtherUsers, coords) {
    const offers = await this.offerRepository.list(
      userId,
      null,
      getOtherUsers,
      coords
    );
    return offers;
  }

  async listOffersByHelpedUser(helpedUserId) {
    const offers = await this.offerRepository.listByHelpedUserId(helpedUserId);
    return offers;
  }

  async getOfferById(offerId) {
    const offer = await this.offerRepository.getById(offerId);

    if (!offer) {
      throw new Error("Offer not found");
    }

    return offer;
  }

  async addPossibleHelpedUsers(helpedUserId, offerId) {
    const offer = await this.getOfferById(offerId);
    if (!offer) throw new Error("Offer not found");

    const helpedUser = await this.userRepository.getById(helpedUserId);
    if (!helpedUser) throw new Error("Helped user not found");

    const possibleHelpedUsers = offer.possibleHelpedUsers;

    if (offer.ownerId === helpedUserId)
      throw new Error("Owner of the offer cannot be a helped user");
    if (!!offer.helpedUserId && offer?.helpedUserId?.includes(helpedUserId)) {
      throw new Error("Offer already is being helped");
    }

    const isUserPossibleHelpedUser =
      offer.possibleHelpedUsers.includes(helpedUserId);

    if (isUserPossibleHelpedUser) {
      throw new Error("User is already a possible helped user");
    }

    offer.possibleHelpedUsers = [...possibleHelpedUsers, helpedUserId];

    await this.offerRepository.update(offer);

    return offer;
  }

  async addHelpedUsers(helpedUserId, offerId) {
    const offer = await this.getOfferById(offerId);
    if (!offer) throw new Error("Offer not found");

    const helpedUser = await this.userRepository.getById(helpedUserId);
    if (!helpedUser) throw new Error("Helped user not found");

    if (offer.ownerId === helpedUserId)
      throw new Error("Owner of the offer cannot be a helped user");
    if (
      offer.helpedUserId !== null &&
      offer?.helpedUserId?.includes(helpedUserId)
    ) {
      throw new Error("Offer already is being helped");
    }

    const isUserPossibleHelpedUser =
      offer?.possibleHelpedUsers?.includes(helpedUserId);
    if (!isUserPossibleHelpedUser) {
      throw new Error("User is not a possible helped user");
    }

    const currentHelpedUsers = offer.helpedUserId || [];

    offer.helpedUserId = [...currentHelpedUsers, helpedUserId];

    offer.possibleHelpedUsers = offer.possibleHelpedUsers.filter(
      (id) => id.toString() !== helpedUserId.toString()
    );

    await this.offerRepository.update(offer);

    return offer;
  }

  async finishOfferById(offerId, ownerUser) {
    const query = { _id: offerId };
    const offerProjection = ["ownerId", "categoryId", "active"];
    const owner = {
      path: "user",
      select: "email",
    };
    let offer = await this.offerRepository.findOne(
      query,
      offerProjection,
      owner
    );

    if (offer.user.email !== ownerUser.email) {
      throw new Error("User not authorized");
    }

    return await this.offerRepository.finishOffer(offer);
  }
}

module.exports = OfferService;
