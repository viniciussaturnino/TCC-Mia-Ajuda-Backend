const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const HelpModel = require("../../src/modules/help/infra/models/HelpModel");
const helpStatusEnum = require("../../src/modules/help/infra/enums/helpStatusEnum");

describe("Help Model", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await HelpModel.deleteMany({});
  });

  test("should not save help without required fields", async () => {
    try {
      const help = new HelpModel({});
      await help.save();
      throw new Error("Validation should fail");
    } catch (err) {
      expect(err.name).toEqual("ValidationError");
      expect(err.errors.title).toBeDefined();
      expect(err.errors.description).toBeDefined();
      expect(err.errors.ownerId).toBeDefined();
    }
  });

  test("should not save help with invalid status", async () => {
    try {
      const help = new HelpModel({
        title: "Test Help",
        description: "This is a test description.",
        ownerId: new mongoose.Types.ObjectId(),
        status: "INVALID_STATUS",
      });
      await help.save();
      throw new Error("Validation should fail");
    } catch (err) {
      expect(err.name).toEqual("ValidationError");
      expect(err.errors.status.message).toEqual(
        "`INVALID_STATUS` is not a valid enum value for path `status`."
      );
    }
  });

  test("should save help with valid data", async () => {
    const help = new HelpModel({
      title: "Test Help",
      description: "This is a test description.",
      ownerId: new mongoose.Types.ObjectId(),
      categoryId: [new mongoose.Types.ObjectId()],
      possibleHelpers: [new mongoose.Types.ObjectId()],
      location: {
        type: "Point",
        coordinates: [-46.633309, -23.55052],
      },
    });
    const savedHelp = await help.save();
    expect(savedHelp._id).toBeDefined();
    expect(savedHelp.title).toEqual("Test Help");
    expect(savedHelp.description).toEqual("This is a test description.");
    expect(savedHelp.status).toEqual(helpStatusEnum.WAITING);
    expect(savedHelp.possibleHelpers.length).toEqual(1);
    expect(savedHelp.location.coordinates).toEqual([-46.633309, -23.55052]);
  });

  test("should have default status as 'WAITING'", async () => {
    const help = new HelpModel({
      title: "Test Help",
      description: "This is a test description.",
      ownerId: new mongoose.Types.ObjectId(),
    });
    const savedHelp = await help.save();
    expect(savedHelp.status).toEqual(helpStatusEnum.WAITING);
  });

  test("should correctly calculate distance in virtual field", () => {
    const help = new HelpModel({
      title: "Test Help",
      description: "This is a test description.",
      ownerId: new mongoose.Types.ObjectId(),
      location: {
        type: "Point",
        coordinates: [-46.633309, -23.55052],
      },
    });

    help.distances = {
      userCoords: [-46.633309, -23.55052],
      coords: [-46.633309, -23.55052],
    };

    expect(help.distance).toBe(0);
  });
});

module.exports = HelpModel;
