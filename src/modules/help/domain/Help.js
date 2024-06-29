const HelpRepository = require("../domain/repositories/HelpRepository");

class Help {
  constructor() {
    this.helpRepository = new HelpRepository();
  }
}

module.exports = Help;
