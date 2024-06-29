const OfferService = require("../../app/OfferService");
const UserService = require("../../../user/app/UserService");

class OfferController {
  constructor() {
    this.offerService = new OfferService();
    this.userService = new UserService();
  }

  async createOffer(req, res, next) {
    try {
      const data = {
        ...req.body,
        ownerId: req.user.id,
      };
      const result = await this.offerService.createOffer(data);
      res.status(201).json(result);
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
      next();
    }
  }

  async getOfferById(req, res, next) {
    const { id } = req.params;

    try {
      const result = await this.offerService.getOfferWithAggregationById(id);
      res.status(200).json(result);
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async listOffers(req, res, next) {
    try {
      const userId = req.user.id;
      const getOtherUsers = req.query.getOtherUsers === "true";
      const coords =
        req.query.coords?.split(",")?.map((coord) => Number(coord)) || "";
      const helpOffers = await this.offerService.listOffers(
        userId,
        getOtherUsers,
        coords
      );
      res.status(200).json(helpOffers);
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
      next();
    }
  }

  async listOffersByHelpedUser(req, res, next) {
    const { helpedUserId } = req.params;
    try {
      const offers =
        await this.offerService.listOffersByHelpedUser(helpedUserId);
      res.status(200).json(offers);
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
      next();
    }
  }

  async addPossibleHelpedUsers(req, res, next) {
    const { helpedUserId, offerId } = req.body;
    try {
      const result = await this.offerService.addPossibleHelpedUsers(
        helpedUserId,
        offerId
      );
      res.status(201).json(result);
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
      next();
    }
  }

  async chooseHelpedUsers(req, res, next) {
    const { helpedUserId, offerId } = req.body;
    try {
      const result = await this.offerService.addHelpedUsers(
        helpedUserId,
        offerId
      );
      res.status(201).json(result);
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
      next();
    }
  }

  async finishOffer(req, res, next) {
    const { offerId } = req.params;
    const ownerUser = req.user;

    try {
      const result = await this.offerService.finishOfferById(
        offerId,
        ownerUser
      );
      res.status(200).json(result);
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
      next();
    }
  }
}

module.exports = OfferController;
