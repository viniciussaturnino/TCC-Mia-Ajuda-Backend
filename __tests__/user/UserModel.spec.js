const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const UserModel = require("../../src/modules/user/infra/models/UserModel");
const UserRepository = require("../../src/modules/user/domain/repositories/UserRepository");
const { cpf, cnpj } = require("cpf-cnpj-validator");
const { validate } = require("email-validator");

describe("User Model ", () => {
  let mongoServer;
  let userRepository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  test("should not save user without required fields", async () => {
    try {
      const user = new UserModel({});
      await user.save();
      throw new Error("Validation should fail");
    } catch (err) {
      expect(err.name).toEqual("ValidationError");
    }
  });

  test("should not save user with invalid email", async () => {
    try {
      const user = new UserModel({
        name: "John Doe",
        email: "invalid_email",
        password: "password123",
        birthday: new Date("1990-01-01"),
      });
      await user.save();
      throw new Error("Validation should fail");
    } catch (err) {
      expect(err.name).toEqual("ValidationError");
      expect(err.errors.email.message).toEqual(
        "invalid_email is not a valid email"
      );
    }
  });

  test("should not save user with invalid CPF", async () => {
    try {
      const user = new UserModel({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
        birthday: new Date("1990-01-01"),
        cpf: "12345678900",
      });
      await user.save();
      throw new Error("Validation should fail");
    } catch (err) {
      expect(err.name).toEqual("ValidationError");
      expect(err.errors.cpf.message).toEqual("12345678900 is not a valid cpf");
    }
  });

  test("should not save user with invalid CNPJ", async () => {
    try {
      const user = new UserModel({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
        birthday: new Date("1990-01-01"),
        cnpj: "1231231212345678000195",
      });
      await user.save();
      throw new Error("Validation should fail");
    } catch (err) {
      expect(err.name).toEqual("ValidationError");
      expect(err.errors.cnpj.message).toEqual(
        "1231231212345678000195 is not a valid cnpj"
      );
    }
  });

  test("should save user with valid data", async () => {
    const user = new UserModel({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
      birthday: new Date("1990-01-01"),
      cpf: "131.527.320-90",
      riskGroup: ["dc"],
      address: {
        cep: "12345-678",
        number: 123,
        city: "São Paulo",
        state: "SP",
      },
      location: {
        type: "Point",
        coordinates: [-46.633309, -23.55052],
      },
    });
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toEqual("John Doe");
    expect(savedUser.email).toEqual("johndoe@example.com");
    expect(savedUser.cpf).toEqual("131.527.320-90");
  });
});
