const Help = require("../domain/Help");
const User = require("../../user/domain/User");

class HelpService {
  constructor() {
    const help = new Help();
    const user = new User();

    this.helpRepository = help.helpRepository;
    this.userRepository = user.userRepository;
  }

  async createHelp(data) {
    // TDD: to be implemented
    return null;
  }

  async getHelpById(id) {
    // TDD: to be implemented
    return null;
  }

  async getUserHelps(userId) {
    // TDD: to be implemented
    return null;
  }

  async getHelpWithAggregationById(id) {
    // TDD: to be implemented
    return null;
  }

  async getWaitingList(coords, ownerId, categoryArray) {
    // TDD: to be implemented
    return null;
  }

  async deactivateHelp(id) {
    // TDD: to be implemented
    return null;
  }

  async getHelpListByStatus({ userId, statusList }) {
    // TDD: to be implemented
    return null;
  }
}

module.exports = HelpService;
