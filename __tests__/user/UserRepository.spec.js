const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const UserRepository = require("../../src/modules/user/domain/repositories/UserRepository");
const UserModel = require("../../src/modules/user/infra/models/UserModel");

describe("UserRepository", () => {
  let mongoServer;
  let userRepository;

  const mockUser = {
    id: 1,
    name: "John Doe",
    password: "password123",
    deviceId: "12345abcde",
    email: "johndoe@example.com",
    birthday: new Date("1990-01-01T00:00:00.000Z"),
    cpf: "131.527.320-90",
    cnpj: "12.345.678/0001-95",
    riskGroup: ["dc"],
    photo: "https://example.com/photo.jpg",
    notificationToken: "abcdef123456",
    address: {
      cep: "12345-678",
      number: 123,
      city: "São Paulo",
      state: "SP",
      complement: "Apartment 456",
    },
    ismentalHealthProfessional: false,
    location: {
      type: "Point",
      coordinates: [-46.633309, -23.55052],
    },
    phone: "+5511999999999",
    registerDate: new Date("2023-06-17T00:00:00.000Z"),
    active: true,
    biography: "This is a sample biography.",
  };

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

  test("create should save a new user", async () => {
    const savedUser = await userRepository.create(mockUser);

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(mockUser.name);
    expect(savedUser.email).toBe(mockUser.email);
  });

  test("get should return all users", async () => {
    const users = [
      { ...mockUser, name: "John Doe", email: "john@example.com" },
      { ...mockUser, name: "Jane Doe", email: "jane@example.com" },
    ];

    await UserModel.insertMany(users);
    const result = await userRepository.get();

    expect(result.length).toBe(2);
    expect(result[0].name).toBe(users[0].name);
    expect(result[1].name).toBe(users[1].name);
  });

  test("getById should return a user by id", async () => {
    const savedUser = await new UserModel(mockUser).save();

    const foundUser = await userRepository.getById(savedUser._id);

    expect(foundUser).toBeDefined();
    expect(foundUser.name).toBe(mockUser.name);
    expect(foundUser.email).toBe(mockUser.email);
  });

  test("getUserByEmail should return a user by email", async () => {
    await new UserModel(mockUser).save();

    const foundUser = await userRepository.getUserByEmail(mockUser.email);

    expect(foundUser).toBeDefined();
    expect(foundUser.name).toBe(mockUser.name);
    expect(foundUser.email).toBe(mockUser.email);
  });

  test("update should update a user", async () => {
    const savedUser = await new UserModel(mockUser).save();

    savedUser.name = "John Updated";
    const updatedUser = await userRepository.update(savedUser);

    expect(updatedUser.name).toBe("John Updated");
  });

  test("checkUserExistence should return user count by email", async () => {
    await new UserModel(mockUser).save();

    const userCount = await userRepository.checkUserExistence(mockUser.email);

    expect(userCount).toBe(1);
  });

  test("checkUserExistence should return 0 if no users are found", async () => {
    const result = await userRepository.checkUserExistence(
      "nonexistent@example.com"
    );
    expect(result).toBe(0);
  });

  test("removeUser should delete a user by id and email", async () => {
    const savedUser = await new UserModel(mockUser).save();

    await userRepository.removeUser({
      id: savedUser._id,
      email: savedUser.email,
    });
    const foundUser = await UserModel.findById(savedUser._id);

    expect(foundUser).toBeNull();
  });

  test("getUsersWithDevice should return users with a device ID", async () => {
    const users = [
      {
        ...mockUser,
        name: "John Doe",
        email: "john@example.com",
        deviceId: "device123",
      },
      {
        ...mockUser,
        name: "Jane Doe",
        email: "jane@example.com",
        deviceId: null,
      },
    ];
    await UserModel.insertMany(users);

    const result = await userRepository.getUsersWithDevice({});

    expect(result.length).toBe(1);
    expect(result[0].name).toBe(users[0].name);
  });

  test("listUsers should return users based on query", async () => {
    const users = [
      { ...mockUser, name: "John Doe", email: "john@example.com" },
      { ...mockUser, name: "Jane Doe", email: "jane@example.com" },
    ];
    await UserModel.insertMany(users);

    const result = await userRepository.listUsers({});

    expect(result.length).toBe(2);
  });

  test("findOneUserWithProjection should return user with specified projection", async () => {
    await new UserModel(mockUser).save();

    const foundUser = await userRepository.findOneUserWithProjection(
      { email: mockUser.email },
      "name"
    );

    expect(foundUser).toBeDefined();
    expect(foundUser.name).toBe(mockUser.name);
    expect(foundUser.email).toBeUndefined();
  });
});
