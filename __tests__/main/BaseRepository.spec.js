const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const BaseRepository = require("../../src/modules/main/domain/repositories/BaseRepository");

const TestUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  lastUpdateDate: Date,
  active: Boolean,
  address: {
    cep: String,
    number: Number,
    city: String,
    state: String,
    complement: String,
  },
});

const UserModel = mongoose.model("User", TestUserSchema);

describe("BaseRepository", () => {
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
    userRepository = new BaseRepository(UserModel);
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  test("$save should save a new document", async () => {
    const user = { name: "John Doe", email: "john@example.com" };
    const savedUser = await userRepository.$save(user);

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(user.name);
    expect(savedUser.email).toBe(user.email);
  });

  test("$save should set lastUpdateDate if _id is defined", async () => {
    const user = { name: "John Doe", email: "john@example.com" };
    const savedUser = await new UserModel(user).save();

    savedUser.name = "John Updated";
    const updatedUser = await userRepository.$save(savedUser);

    expect(updatedUser._id).toBeDefined();
    expect(updatedUser.lastUpdateDate).toBeDefined();
    expect(updatedUser.name).toBe("John Updated");
  });

  test("$save should not set lastUpdateDate if _id is not defined", async () => {
    const user = { name: "John Doe", email: "john@example.com" };
    const savedUser = await userRepository.$save(user);

    expect(savedUser._id).toBeDefined();
    expect(savedUser.lastUpdateDate).toBeUndefined();
    expect(savedUser.name).toBe(user.name);
    expect(savedUser.email).toBe(user.email);
  });

  test("$get should return all documents", async () => {
    const users = [
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Doe", email: "jane@example.com" },
    ];

    await UserModel.insertMany(users);
    const result = await userRepository.$get();

    expect(result.length).toBe(2);
    expect(result[0].name).toBe(users[0].name);
    expect(result[1].name).toBe(users[1].name);
  });

  test("$getById should return a document by id", async () => {
    const user = { name: "John Doe", email: "john@example.com", active: true };
    const savedUser = await new UserModel(user).save();

    const foundUser = await userRepository.$getById(savedUser._id);

    expect(foundUser).toBeDefined();
    expect(foundUser.name).toBe(user.name);
    expect(foundUser.email).toBe(user.email);
  });

  test("$getById should convert string ID to ObjectId if valid", async () => {
    const user = { name: "John Doe", email: "john@example.com", active: true };
    const savedUser = await new UserModel(user).save();
    const stringId = savedUser._id.toString();

    const foundUser = await userRepository.$getById(stringId);

    expect(foundUser).toBeDefined();
    expect(foundUser._id.toString()).toBe(savedUser._id.toString());
  });

  test("$getById should throw error if string ID is invalid", async () => {
    const invalidStringId = "invalid-id-string";

    await expect(userRepository.$getById(invalidStringId)).rejects.toThrow(
      "ID is not an ObjectId"
    );
  });

  test("$getById should return a record by id when active is false and populate is null", async () => {
    const user = new UserModel({
      name: "John Doe",
      email: "john@example.com",
      active: false,
    });
    const savedUser = await user.save();

    const result = await userRepository.$getById(savedUser._id, false);
    expect(result).toBeDefined();
    expect(result.name).toBe("John Doe");
    expect(result.email).toBe("john@example.com");
  });

  test("$update should update an existing document", async () => {
    const user = { name: "John Doe", email: "john@example.com" };
    const savedUser = await new UserModel(user).save();

    savedUser.name = "John Smith";
    const updatedUser = await userRepository.$update(savedUser);

    expect(updatedUser.name).toBe("John Smith");
  });

  test("$destroy should delete a document", async () => {
    const user = { name: "John Doe", email: "john@example.com" };
    const savedUser = await new UserModel(user).save();

    await userRepository.$destroy({ _id: savedUser._id });
    const foundUser = await UserModel.findById(savedUser._id);

    expect(foundUser).toBeNull();
  });

  test("$saveMany should save multiple documents", async () => {
    const users = [
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Doe", email: "jane@example.com" },
    ];

    const savedUsers = await userRepository.$saveMany(users);

    expect(savedUsers.length).toBe(2);
    expect(savedUsers[0]._id).toBeDefined();
    expect(savedUsers[1]._id).toBeDefined();
  });

  test("$populateExistingDoc should populate document fields", async () => {
    const address = {
      cep: "12345-678",
      number: 123,
      city: "São Paulo",
      state: "SP",
      complement: "Apartment 456",
    };

    const user = { name: "John Doe", email: "john@example.com", address };
    const savedUser = await new UserModel(user).save();

    const populatedUser = await userRepository.$populateExistingDoc(
      savedUser,
      "address"
    );
    expect(populatedUser.address.cep).toBe(address.cep);
  });

  test("$listAggregate should return aggregated data", async () => {
    const users = [
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Doe", email: "jane@example.com" },
    ];

    await UserModel.insertMany(users);

    const aggregationPipeline = [{ $match: { email: "john@example.com" } }];

    const result = await userRepository.$listAggregate(aggregationPipeline);

    expect(result.length).toBe(1);
    expect(result[0].email).toBe("john@example.com");
  });

  test("$list should return documents matching query", async () => {
    const users = [
      { name: "John Doe", email: "john@example.com", active: true },
      { name: "Jane Doe", email: "jane@example.com", active: true },
    ];

    await UserModel.insertMany(users);
    const result = await userRepository.$list({ active: true });

    expect(result.length).toBe(2);
    expect(result[0].name).toBe(users[0].name);
    expect(result[1].name).toBe(users[1].name);
  });

  test("$countDocuments should return the count of documents matching query", async () => {
    const users = [
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Doe", email: "jane@example.com" },
    ];

    await UserModel.insertMany(users);
    const count = await userRepository.$countDocuments({});

    expect(count).toBe(2);
  });

  test("$findOne should return a document matching query", async () => {
    const user = { name: "John Doe", email: "john@example.com" };
    await new UserModel(user).save();

    const foundUser = await userRepository.$findOne({
      email: "john@example.com",
    });

    expect(foundUser).toBeDefined();
    expect(foundUser.email).toBe(user.email);
  });

  test("$findOneAndUpdate should update a document matching query", async () => {
    const user = { name: "John Doe", email: "john@example.com" };
    const savedUser = await new UserModel(user).save();

    await userRepository.$findOneAndUpdate(
      { email: "john@example.com" },
      { name: "John Smith" }
    );

    const updatedUser = await UserModel.findById(savedUser._id);

    expect(updatedUser.name).toBe("John Smith");
  });
});
