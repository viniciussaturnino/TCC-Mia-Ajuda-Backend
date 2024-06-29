const HelpService = require("../../app/HelpService");
const UserService = require("../../../user/app/UserService");

class HelpController {
  constructor() {
    this.helpService = new HelpService();
    this.userService = new UserService();
  }

  async createHelp(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async getUserHelps(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async getHelpById(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async getWaitingList(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async getHelpListByStatus(req, res, next) {
    // TDD: to be implemented
    return null;
  }

  async deactivateHelp(req, res, next) {
    // TDD: to be implemented
    return null;
  }
}

module.exports = HelpController;
