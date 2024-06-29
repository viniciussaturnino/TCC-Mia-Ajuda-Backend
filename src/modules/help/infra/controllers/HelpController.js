const HelpService = require("../../app/HelpService");
const UserService = require("../../../user/app/UserService");

class HelpController {
  constructor() {
    this.helpService = new HelpService();
    this.userService = new UserService();
  }

  async createHelp(req, res, next) {
    try {
      const data = {
        ...req.body,
        ownerId: req.user.id,
      };
      const result = await this.helpService.createHelp(data);
      res.status(201).json(result);
      next();
    } catch (err) {
      res.status(400).send({ error: err.message });
      next();
    }
  }

  async getHelps(_req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async getUserHelps(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await this.helpService.getUserHelps(userId);
      res.status(200).json(result);
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getHelpById(req, res, next) {
    const { id } = req.params;

    try {
      const result = await this.helpService.getHelpWithAggregationById(id);
      res.status(200).json(result);
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getWaitingList(req, res, next) {
    try {
      const ownerId = req.user.id;

      /* query params should follow the following pattern separated by comma
       *
       * (...)?categoryId=id1,id2
       */
      const coords = req?.query?.coords
        ?.split(",")
        ?.map((coord) => Number(coord));
      const categoryArray = req?.query?.categoryId?.split(",");

      if (!coords) {
        res.status(400).json({ error: "Coordinates are required" });
        next();
      }

      const result = await this.helpService.getWaitingList(
        coords,
        ownerId,
        categoryArray
      );
      res.status(200);
      res.json(result);
      next();
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async getHelpListByStatus(req, res, next) {
    try {
      /* statusList should follow the following pattern on query params
       * separated by comma
       *
       * (...)?statusList=on_going,finished
       */
      const statusList = req?.query?.statusList?.split(",");

      if (!statusList) {
        res.status(400).json({ error: "Status List is required" });
        next();
      }

      const userId = req.user.id;

      const result = await this.helpService.getHelpListByStatus({
        userId,
        statusList,
      });
      res.status(200).json(result);
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async deactivateHelp(req, res, next) {
    const { id } = req.params;

    try {
      const result = await this.helpService.deactivateHelp(id);
      res.status(200).json(result);
      next();
    } catch (err) {
      res.status(400).json({ error: err.message });
      next();
    }
  }

  async addPossibleHelpers(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async chooseHelper(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async helperConfirmation(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async ownerConfirmation(req, res, next) {
    // TDD: to be implemented
    return null;
  }
}

module.exports = HelpController;
