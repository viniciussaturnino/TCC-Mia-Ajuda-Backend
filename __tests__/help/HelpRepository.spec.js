const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const HelpRepository = require("../../src/modules/help/domain/repositories/HelpRepository");
const HelpModel = require("../../src/modules/help/infra/models/HelpModel");
const UserModel = require("../../src/modules/user/infra/models/UserModel");
const CategoryModel = require("../../src/modules/category/infra/models/CategoryModel");
const helpStatusEnum = require("../../src/modules/help/infra/enums/helpStatusEnum");

describe("HelpRepository", () => {
  let mongoServer;
  let helpRepository;

  const userId = new mongoose.Types.ObjectId();
  const categoryId = new mongoose.Types.ObjectId();

  const mockHelp = {
    title: "Test Help",
    description: "This is a test help",
    ownerId: userId,
    categoryId: categoryId,
    status: helpStatusEnum.WAITING,
    location: {
      type: "Point",
      coordinates: [-46.633309, -23.55052],
    },
    helperId: userId,
  };

  const mockUser = {
    id: userId,
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

  const mockCategory = {
    name: "Category 1",
    description: "Description of category 1",
    active: true,
    id: categoryId,
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

  beforeEach(async () => {
    helpRepository = new HelpRepository();
    await new UserModel(mockUser).save();
    await new CategoryModel(mockCategory).save();
  });

  afterEach(async () => {
    await HelpModel.deleteMany({});
    await UserModel.deleteMany({});
    await CategoryModel.deleteMany({});
  });

  test("create should save a new help", async () => {
    const savedHelp = await helpRepository.create(mockHelp);

    expect(savedHelp._id).toBeDefined();
    expect(savedHelp.title).toBe(mockHelp.title);
    expect(savedHelp.ownerId.toString()).toBe(mockHelp.ownerId.toString());
  });

  test("getById should return a help by id", async () => {
    const savedHelp = await new HelpModel(mockHelp).save();

    const foundHelp = await helpRepository.getById(savedHelp._id);

    expect(foundHelp).toBeDefined();
    expect(foundHelp.title).toBe(mockHelp.title);
    expect(foundHelp.ownerId.toString()).toBe(mockHelp.ownerId.toString());
  });

  test("getByUserId should return helps by user id", async () => {
    const userId = mockHelp.ownerId;
    await new HelpModel(mockHelp).save();

    const helps = await helpRepository.getByUserId(userId);

    expect(helps.length).toBe(1);
    expect(helps[0].ownerId.toString()).toBe(userId.toString());
  });

  test("update should update a help", async () => {
    const savedHelp = await new HelpModel(mockHelp).save();

    savedHelp.title = "Updated Title";
    await helpRepository.update(savedHelp);

    const updatedHelp = await HelpModel.findById(savedHelp._id);

    expect(updatedHelp.title).toBe("Updated Title");
  });

  test("countDocuments should count active helps for a user", async () => {
    const userId = mockHelp.ownerId;
    await new HelpModel(mockHelp).save();

    const count = await helpRepository.countDocuments(userId);

    expect(count).toBe(1);
  });

  test("getHelpListByStatus should return helps by status for a user", async () => {
    const userId = mockHelp.ownerId;
    const statusList = [helpStatusEnum.WAITING];
    await new HelpModel(mockHelp).save();

    const helpList = await helpRepository.getHelpListByStatus(
      userId,
      statusList
    );

    expect(helpList.length).toBe(1);
    expect(helpList[0].status).toBe(helpStatusEnum.WAITING);
  });

  test("getByIdWithAggregation should return a help by id with aggregation", async () => {
    const savedHelp = await new HelpModel(mockHelp).save();

    const foundHelp = await helpRepository.getByIdWithAggregation(
      savedHelp._id
    );

    expect(foundHelp).toBeDefined();
    expect(foundHelp.title).toBe(mockHelp.title);
    expect(foundHelp.ownerId.toString()).toBe(mockHelp.ownerId.toString());
    expect(foundHelp.user).toBeDefined();
    expect(foundHelp.categories).toBeDefined();
  });

  test("get should return all helps", async () => {
    await new HelpModel(mockHelp).save();
    const helps = await helpRepository.get();

    expect(helps.length).toBe(1);
    expect(helps[0].title).toBe(mockHelp.title);
  });

  test("getWaitingList should return waiting helps with distances", async () => {
    const userId = mockHelp.ownerId;
    const categoryArray = [mockHelp.categoryId];
    await new HelpModel(mockHelp).save();

    const helpsWithDistances = await helpRepository.getWaitingList(
      mockHelp.location.coordinates,
      userId,
      categoryArray
    );

    expect(helpsWithDistances.length).toBe(1);
    expect(helpsWithDistances[0].title).toBe(mockHelp.title);
    expect(helpsWithDistances[0].distance).toBeDefined();
  });

  test("should not filter by category if categoryArray is not provided", async () => {
    const currentOwner = new mongoose.Types.ObjectId();
    const mockHelp1 = {
      title: "Help 1",
      description: "Description for Help 1",
      ownerId: currentOwner,
      status: helpStatusEnum.WAITING,
      active: true,
      categoryId: new mongoose.Types.ObjectId(),
      location: { type: "Point", coordinates: [-46.633309, -23.55052] },
    };

    const mockHelp2 = {
      title: "Help 2",
      description: "Description for Help 2",
      ownerId: currentOwner,
      status: helpStatusEnum.WAITING,
      active: true,
      categoryId: new mongoose.Types.ObjectId(),
      location: { type: "Point", coordinates: [-46.633309, -23.55052] },
    };

    const savedHelp1 = await new HelpModel(mockHelp1).save();
    const savedHelp2 = await new HelpModel(mockHelp2).save();

    const helps = await helpRepository.getWaitingList({}, mockHelp1.ownerId);

    expect(helps).toHaveLength(2);
    expect(helps[0]._id.toString()).toBe(savedHelp1._id.toString());
    expect(helps[1]._id.toString()).toBe(savedHelp2._id.toString());
  });
});
