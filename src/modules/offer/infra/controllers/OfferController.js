const OfferService = require("../../app/OfferService");
const UserService = require("../../../user/app/UserService");

class OfferController {
  constructor() {
    this.offerService = new OfferService();
    this.userService = new UserService();
  }

  async createOffer(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async getOfferById(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async listOffers(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async listOffersByHelpedUser(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async addPossibleHelpedUsers(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async chooseHelpedUsers(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async finishOffer(req, res, next) {
    // TDD: to be implemented
    return null;
  }
}

module.exports = OfferController;
