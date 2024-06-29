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
    // TDD: to be implemented
    return null;
  }

  async getOfferWithAggregationById(id) {
    // TDD: to be implemented
    return null;
  }

  async listOffers(userId, getOtherUsers, coords) {
    // TDD: to be implemented
    return null;
  }

  async listOffersByHelpedUser(helpedUserId) {
    // TDD: to be implemented
    return null;
  }

  async getOfferById(offerId) {
    // TDD: to be implemented
    return null;
  }

  async addPossibleHelpedUsers(helpedUserId, offerId) {
    // TDD: to be implemented
    return null;
  }

  async addHelpedUsers(helpedUserId, offerId) {
    // TDD: to be implemented
    return null;
  }

  async finishOfferById(offerId, ownerUser) {
    // TDD: to be implemented
    return null;
  }
}

module.exports = OfferService;
