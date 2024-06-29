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
    try {
      const result = await this.helpRepository.get();
      return result;
    } catch (err) {
      throw err;
    }
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
    const help = await this.getHelpById(helpId);

    if (helperId === help.ownerId) {
      throw new Error("You can't be a helper in your own help request");
    }
    if (help.helperId) {
      throw new Error("Help request already has a helper");
    }
    const isUserAlreadyHelper = help?.possibleHelpers?.includes(helperId);

    if (isUserAlreadyHelper) {
      throw new Error("User is already a possible helper");
    }

    const helperUser = await this.userRepository.getById(helperId);
    if (!helperUser) throw new Error("Helper user not found");

    help.possibleHelpers.push(helperId);

    await this.helpRepository.update(help);

    return help;
  }

  async chooseHelper(helpId, helperId) {
    const help = await this.getHelpById(helpId);

    if (help.helperId) {
      throw new Error("Help request already has a helper");
    }

    const isUserPossibleHelper = help.possibleHelpers.includes(helperId);
    if (!isUserPossibleHelper) {
      throw new Error("Chosen helper is not a possible helper");
    }

    const helperUser = await this.userRepository.getById(helperId);
    if (!helperUser) throw new Error("Helper user not found");

    help.helperId = helperId;
    help.status = "on_going";
    help.possibleHelpers = [];

    await this.helpRepository.update(help);

    return help;
  }

  async helperConfirmation(helpId, helperId) {
    const help = await this.getHelpById(helpId);

    if (help.helperId.toString() !== helperId.toString()) {
      throw new Error("User is not the helper of this help request");
    }
    if (help.status === helpStatusEnum.HELPER_FINISHED) {
      throw new Error("User has already finished this help request");
    }
    if (help.status === helpStatusEnum.FINISHED) {
      throw new Error("Help request is already finished");
    }

    if (help.status === helpStatusEnum.OWNER_FINISHED) {
      help.status = helpStatusEnum.FINISHED;
      help.active = false;
    } else {
      help.status = helpStatusEnum.HELPER_FINISHED;
    }

    await this.helpRepository.update(help);

    return help;
  }

  async ownerConfirmation(helpId, ownerId) {
    const help = await this.getHelpById(helpId);

    if (help.ownerId.toString() !== ownerId.toString()) {
      throw new Error("User is not the owner of this help request");
    }
    if (help.status === helpStatusEnum.OWNER_FINISHED) {
      throw new Error("Usuário já confirmou a finalização da ajuda");
    }
    if (help.status === helpStatusEnum.FINISHED) {
      throw new Error("Essa ajuda já foi finalizada");
    }

    if (help.status === helpStatusEnum.HELPER_FINISHED) {
      help.status = helpStatusEnum.FINISHED;
      help.active = false;
    } else {
      help.status = helpStatusEnum.OWNER_FINISHED;
    }

    await this.helpRepository.update(help);

    return help;
  }
}

module.exports = HelpService;
