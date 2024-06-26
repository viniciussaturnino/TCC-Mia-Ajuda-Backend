const BaseRepository = require("../../../main/domain/repositories/BaseRepository");
const UserSchema = require("../../infra/models/UserModel");

class UserRepository extends BaseRepository {
  constructor() {
    super(UserSchema);
  }

  async create(user) {
    // TDD: to be implemented.
    return null;
  }

  async get() {
    // TDD: to be implemented.
    return null;
  }

  async getById(id) {
    // TDD: to be implemented.
    return null;
  }

  async getUserByEmail(email) {
    // TDD: to be implemented.
    return null;
  }

  async update(user) {
    // TDD: to be implemented.
    return null;
  }

  async checkUserExistence(email) {
    // TDD: to be implemented.
    return null;
  }

  async removeUser({ id, email }) {
    // TDD: to be implemented.
    return null;
  }

  async getUsersWithDevice({ query = {}, fields = "" }) {
    // TDD: to be implemented.
    return null;
  }

  async listUsers({ query = {}, fields = "" }) {
    // TDD: to be implemented.
    return null;
  }

  async findOneUserWithProjection(query, projection) {
    // TDD: to be implemented.
    return null;
  }
}

module.exports = UserRepository;
