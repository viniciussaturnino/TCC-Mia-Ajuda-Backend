const bcrypt = require("bcryptjs");
const User = require("../domain/User");
const { formatCnpj, formatCpf } = require("../../main/utils/processString");
const { generateAuthToken } = require("../../main/utils/jwt");
const { PASSWORD_SALT } = require("../../main/config/vars");

class UserService {
  constructor() {
    const user = new User();
    this.userRepository = user.userRepository;
  }

  async createUser(data) {
    try {
      if (!data.cnpj && !data.cpf) {
        throw new Error("CPF or CNPJ is required.");
      }

      const isUserRegistered = await this.userRepository.checkUserExistence(
        data.email
      );

      if (isUserRegistered) {
        throw new Error("User already exists.");
      }

      if (data.password.length < 8 || data.password.length > 14) {
        throw new Error("Invalid password.");
      }
      
      
      const saltRounds = await bcrypt.genSalt(parseInt(PASSWORD_SALT));
      const hashedPassword = await bcrypt.hash(data?.password, saltRounds);

      if (data.cpf) {
        data.cpf = formatCpf(data.cpf);
      } else {
        data.cnpj = formatCnpj(data.cnpj);
      }

      data.email = data.email.toLowerCase();
      data.password = hashedPassword;

      const createdUser = await this.userRepository.create(data);
      return createdUser;
    } catch (err) {
      throw err;
    }
  }

  async getUsers() {
    try {
      const result = await this.userRepository.get();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getUserByEmail(email) {
    try {
      const result = await this.userRepository.getUserByEmail(email);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getUserById(id) {
    try {
      const result = await this.userRepository.getById(id);
      return result;
    } catch (err) {
      throw err;
    }
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
    const user = await this.getUserById(id);

    user.email = email || user.email;
    user.photo = photo || user.photo;
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.notificationToken = notificationToken || user.notificationToken;
    user.address = address || user.address;
    user.biography = biography || user.biography;
    user.deviceId = deviceId || user.deviceId;
    user.location = location || user.location;

    const result = await this.userRepository.update(user);
    return result;
  }

  async updateUserAddressById(id, { cep, number, city, state, complement }) {
    const user = await this.getUserById(id);

    user.address.cep = cep || user.address.cep;
    user.address.number = number || user.address.number;
    user.address.city = city || user.address.city;
    user.address.state = state || user.address.state;
    user.address.complement = complement || user.address.complement;

    const result = await this.userRepository.update(user);
    return result;
  }

  async updateUserLocationById(id, { long, lat }) {
    const user = await this.getUserById(id);

    if (long || lat) {
      user.location.coordinates[0] = long || user.location.coordinates[0];
      user.location.coordinates[1] = lat || user.location.coordinates[1];
    }

    const result = await this.userRepository.update(user);

    return result;
  }

  async login({ email, password }) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new Error("User not found.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password.");
    }

    const token = generateAuthToken(user);

    return { authToken: token };
  }
}

module.exports = UserService;
