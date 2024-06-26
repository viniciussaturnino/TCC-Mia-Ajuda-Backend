const UserRepository = require("../domain/repositories/UserRepository");

class User {
  constructor() {
    this.userRepository = new UserRepository();
  }
}

module.exports = User;
