const UserService = require("../../app/UserService");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async createUser(req, res, next) {
    // TDD: to be implemented.
    return null;
  }

  async getUsers(_req, res, next) {
    // TDD: to be implemented.
    return null;
  }

  async getUserByEmail(req, res, next) {
    // TDD: to be implemented.
    return null;
  }

  async getUserById(req, res, next) {
    // TDD: to be implemented.
    return null;
  }

  async updateUserById(req, res, next) {
    // TDD: to be implemented.
    return null;
  }

  async updateUserAddressById(req, res, next) {
    // TDD: to be implemented.
    return null;
  }

  async updateUserLocationById(req, res, next) {
    // TDD: to be implemented.
    return null;
  }

  async login(req, res, next) {
    // TDD: to be implemented.
    return null;
  }
}

module.exports = UserController;
