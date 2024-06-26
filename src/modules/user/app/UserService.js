const User = require("../domain/User");

class UserService {
  constructor() {
    const user = new User();
    this.userRepository = user.userRepository;
  }

  async createUser(data) {
    // TDD: to be implemented.
    return null;
  }

  async getUsers() {
    // TDD: to be implemented.
    return null;
  }

  async getUserByEmail(email) {
    // TDD: to be implemented.
    return null;
  }

  async getUserById(id) {
    // TDD: to be implemented.
    return null;
  }

  async updateUserById(
    id,
    {
      email,
      photo,
      name,
      phone,
      notificationToken,
      address,
      deviceId,
      location,
      biography,
    }
  ) {
    // TDD: to be implemented.
    return null;
  }

  async updateUserAddressById(id, { cep, number, city, state, complement }) {
    // TDD: to be implemented.
    return null;
  }

  async updateUserLocationById(id, { long, lat }) {
    // TDD: to be implemented.
    return null;
  }

  async login({ email, password }) {
    // TDD: to be implemented.
    return null;
  }
}

module.exports = UserService;
