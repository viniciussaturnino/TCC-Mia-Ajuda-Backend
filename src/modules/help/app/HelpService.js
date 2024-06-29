const helpStatusEnum = require("../infra/enums/helpStatusEnum");
const Help = require("../domain/Help");
const User = require("../../user/domain/User");

const MAXIMUM_HELP_REQUESTS = 15;

class HelpService {
  constructor() {
    const help = new Help();
    const user = new User();

    this.helpRepository = help.helpRepository;
    this.userRepository = user.userRepository;
  }

  async createHelp(data) {
    const countHelp = await this.helpRepository.countDocuments(data.ownerId);
    if (countHelp >= MAXIMUM_HELP_REQUESTS) {
      throw new Error(
        `User has reached the maximum number of help requests: ${MAXIMUM_HELP_REQUESTS}`
      );
    }

    const createdHelp = await this.helpRepository.create(data);

    return createdHelp;
  }

  async getHelpById(id) {
    const help = await this.helpRepository.getById(id);

    if (!help) {
      throw new Error("Help request not found");
    }

    return help;
  }

  async getUserHelps(userId) {
    const helps = await this.helpRepository.getByUserId(userId);

    if (!helps) {
      throw new Error("User doesn't have any help requests");
    }

    return helps;
  }

  async getHelpWithAggregationById(id) {
    const help = await this.helpRepository.getByIdWithAggregation(id);

    if (!help) {
      throw new Error("Help request not found");
    }

    return help;
  }

  async getHelps() {
    // TDD: to be implemented
    return null;
  }

  async getWaitingList(coords, ownerId, categoryArray) {
    const helplist = await this.helpRepository.getWaitingList(
      coords,
      ownerId,
      categoryArray
    );
    if (!helplist || helplist?.length === 0) {
      throw new Error("Help requests not found in your distance range");
    }

    return helplist;
  }

  async deactivateHelp(id) {
    let help = await this.getHelpById(id);

    help.active = false;

    await this.helpRepository.update(help);

    return help;
  }

  async getHelpListByStatus({ userId, statusList }) {
    const checkHelpStatusExistence = statusList.filter(
      (item) => !Object.values(helpStatusEnum).includes(item)
    );

    if (checkHelpStatusExistence.length > 0) {
      throw new Error("Invalid status");
    }

    const helpList = await this.helpRepository.getHelpListByStatus(
      userId,
      statusList
    );

    return helpList;
  }

  async addPossibleHelpers(helpId, helperId) {
    // TDD: to be implemented
    return null;
  }

  async chooseHelper(helpId, helperId) {
    // TDD: to be implemented
    return null;
  }

  async helperConfirmation(helpId, helperId) {
    // TDD: to be implemented
    return null;
  }

  async ownerConfirmation(helpId, ownerId) {
    // TDD: to be implemented
    return null;
  }
}

module.exports = HelpService;
