const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const OfferRepository = require("../../src/modules/offer/domain/repositories/OfferRepository");
const OfferModel = require("../../src/modules/offer/infra/models/OfferModel");
const UserModel = require("../../src/modules/user/infra/models/UserModel");
const CategoryModel = require("../../src/modules/category/infra/models/CategoryModel");

describe("OfferRepository", () => {
  let mongoServer;
  let offerRepository;

  const mockOwnerId = new mongoose.Types.ObjectId();
  const mockCategoryId = new mongoose.Types.ObjectId();

  const mockOffer = {
    ownerId: mockOwnerId,
    categoryId: mockCategoryId,
    title: "Test Offer",
    description: "This is a test offer",
    creationDate: new Date(),
    location: {
      type: "Point",
      coordinates: [-46.633309, -23.55052],
    },
  };

  const mockUser = {
    id: mockOwnerId,
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
    id: mockCategoryId,
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
    offerRepository = new OfferRepository();
    await new UserModel(mockUser).save();
    await new CategoryModel(mockCategory).save();
  });

  afterEach(async () => {
    await OfferModel.deleteMany({});
    await UserModel.deleteMany({});
    await CategoryModel.deleteMany({});
  });

  test("create should save a new offer", async () => {
    const savedOffer = await offerRepository.create(mockOffer);

    expect(savedOffer._id).toBeDefined();
    expect(savedOffer.ownerId).toBe(mockOffer.ownerId);
    expect(savedOffer.title).toBe(mockOffer.title);
  });

  test("getByIdWithAggregation should return an offer with user details and categories", async () => {
    const savedOffer = await new OfferModel(mockOffer).save();

    const foundOffer = await offerRepository.getByIdWithAggregation(
      savedOffer._id
    );

    expect(foundOffer).toBeDefined();
    expect(foundOffer._id.toString()).toBe(savedOffer._id.toString());
    expect(foundOffer.user).toBeDefined();
    expect(foundOffer.categories).toBeDefined();
  });

  test("list should return offers based on parameters", async () => {
    await new OfferModel(mockOffer).save();

    const categoryArray = [mockCategoryId];
    const getOtherUsers = true;
    const coords = [-46.633309, -23.55052];

    const result = await offerRepository.list(
      mockOwnerId,
      categoryArray,
      getOtherUsers,
      coords
    );

    expect(result.length).toBe(1);
    expect(result[0]._id).toBeDefined();
    expect(result[0].ownerId.toString()).toBe(mockOwnerId.toString());
  });

  test("list should return offers without calculating distances when coords is falsy", async () => {
    await new OfferModel(mockOffer).save();

    const categoryArray = [mockCategoryId];
    const getOtherUsers = true;
    const coords = null;

    const result = await offerRepository.list(
      mockOwnerId,
      categoryArray,
      getOtherUsers,
      coords
    );

    expect(result.length).toBeGreaterThan(0);

    const firstOffer = result[0];
    expect(firstOffer._id).toBeDefined();
    expect(firstOffer.title).toBe(mockOffer.title);
    expect(firstOffer.categoryId.toString()).toBe(mockCategoryId.toString());
    expect(firstOffer.ownerId.toString()).toBe(mockOwnerId.toString());

    expect(firstOffer.distances).toBeUndefined();
  });

  test("listByHelpedUserId should return offers by helped user id", async () => {
    const helpedUserId = new mongoose.Types.ObjectId();
    const mockOfferHelped = { ...mockOffer, helpedUserId };
    await new OfferModel(mockOfferHelped).save();

    const result = await offerRepository.listByHelpedUserId(helpedUserId);

    expect(result.length).toBe(1);
    expect(result[0].helpedUserId[0].toString()).toBe(helpedUserId.toString());
  });

  test("getById should return an offer by id", async () => {
    const savedOffer = await new OfferModel(mockOffer).save();

    const foundOffer = await offerRepository.getById(savedOffer._id);

    expect(foundOffer).toBeDefined();
    expect(foundOffer._id.toString()).toBe(savedOffer._id.toString());
  });

  test("finishOffer should update offer to inactive", async () => {
    const savedOffer = await new OfferModel(mockOffer).save();

    await offerRepository.finishOffer(savedOffer);
    const foundOffer = await OfferModel.findById(savedOffer._id);

    expect(foundOffer.active).toBe(false);
  });

  test("update should update an offer", async () => {
    const savedOffer = await new OfferModel(mockOffer).save();

    savedOffer.title = "Updated Title";
    await offerRepository.update(savedOffer);

    const updatedOffer = await OfferModel.findById(savedOffer._id);

    expect(updatedOffer.title).toBe("Updated Title");
  });

  test("findOne should find an offer by query", async () => {
    const savedOffer = await new OfferModel(mockOffer).save();

    const query = { _id: savedOffer._id };
    const projection = ["title", "description"];

    const foundOffer = await offerRepository.findOne(query, projection);

    expect(foundOffer).toBeDefined();
    expect(foundOffer.title).toBe(mockOffer.title);
    expect(foundOffer.description).toBe(mockOffer.description);
  });

  test("finishOffer should set offer to inactive", async () => {
    const savedOffer = await new OfferModel(mockOffer).save();

    await offerRepository.finishOffer(savedOffer);

    const foundOffer = await OfferModel.findById(savedOffer._id);

    expect(foundOffer.active).toBe(false);
  });

  test("getOfferListQuery should return matchQuery with ownerId and possibleHelpedUsers when getOtherUsers is false", () => {
    const userId = mockOwnerId;
    const getOtherUsers = false;
    const categoryArray = [mockCategoryId];

    const matchQuery = offerRepository.getOfferListQuery(
      userId,
      getOtherUsers,
      categoryArray
    );

    expect(matchQuery).toHaveProperty("active", true);
    expect(matchQuery).toHaveProperty("ownerId");
    expect(matchQuery.ownerId).toEqual({ $ne: userId });
    expect(matchQuery).toHaveProperty("possibleHelpedUsers");
    expect(matchQuery.possibleHelpedUsers).toEqual({ $nin: [userId] });

    expect(matchQuery).toHaveProperty("categoryId");
    expect(matchQuery.categoryId).toEqual({ $in: categoryArray });
  });
});
