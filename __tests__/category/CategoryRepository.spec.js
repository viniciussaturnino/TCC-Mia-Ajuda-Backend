const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const CategoryRepository = require("../../src/modules/category/domain/repositories/CategoryRepository");
const CategoryModel = require("../../src/modules/category/infra/models/CategoryModel");

describe("CategoryRepository", () => {
  let mongoServer;
  let categoryRepository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    categoryRepository = new CategoryRepository();
  });

  afterEach(async () => {
    await CategoryModel.deleteMany({});
  });

  test("getById should retrieve a category by id", async () => {
    const mockCategory = {
      name: "Test Category",
      description: "Description test",
    };
    const savedCategory = await CategoryModel.create(mockCategory);

    const result = await categoryRepository.getById(savedCategory._id);

    expect(result).toBeDefined();
    expect(result.name).toBe(mockCategory.name);
  });

  test("list should retrieve all categories", async () => {
    const mockCategories = [
      { name: "Category 1", description: "Description 1" },
      { name: "Category 2", description: "Description 2" },
    ];
    await CategoryModel.create(mockCategories);

    const result = await categoryRepository.list();

    expect(result).toHaveLength(2);
  });
});
