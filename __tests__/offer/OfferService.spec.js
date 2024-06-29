const OfferService = require("../../src/modules/offer/app/OfferService");
const OfferRepository = require("../../src/modules/offer/domain/repositories/OfferRepository");
const helpStatusEnum = require("../../src/modules/help/infra/enums/helpStatusEnum");

jest.mock("../../src/modules/user/domain/User");
jest.mock("../../src/modules/offer/domain/repositories/OfferRepository");

describe("OfferService", () => {
  let offerService;
  let mockOfferRepository;
  let mockUserRepository;

  const mockOffer = {};

  beforeEach(() => {
    const MockUser = require("../../src/modules/user/domain/User");

    mockUserRepository = {
      getById: jest.fn(),
    };

    MockUser.mockImplementation(() => ({ userRepository: mockUserRepository }));

    mockOfferRepository = new OfferRepository();
    offerService = new OfferService();
    offerService.offerRepository = mockOfferRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createOffer should create a new offer", async () => {
    const data = {
      ownerId: "ownerId",
    };
    const userId = "userId";
    const expectedResult = { id: "123", ownerId: userId };
    mockOfferRepository.create.mockResolvedValue(expectedResult);

    const result = await offerService.createOffer(data, userId);

    expect(mockOfferRepository.create).toHaveBeenCalledWith(data);
    expect(result).toEqual(expectedResult);
  });

  test("getOfferWithAggregationById should return the offer with aggregation if it exists", async () => {
    const offerId = "offerId";
    const expectedOffer = { id: offerId };
    mockOfferRepository.getByIdWithAggregation.mockResolvedValue(expectedOffer);

    const result = await offerService.getOfferWithAggregationById(offerId);

    expect(mockOfferRepository.getByIdWithAggregation).toHaveBeenCalledWith(
      offerId
    );
    expect(result).toEqual(expectedOffer);
  });

  test("getOfferWithAggregationById should throw an error if offer does not exist", async () => {
    const offerId = "nonexistentOfferId";
    mockOfferRepository.getByIdWithAggregation.mockResolvedValue(null);

    await expect(
      offerService.getOfferWithAggregationById(offerId)
    ).rejects.toThrow("Offer not found");
    expect(mockOfferRepository.getByIdWithAggregation).toHaveBeenCalledWith(
      offerId
    );
  });

  test("listOffers should list offers based on parameters", async () => {
    const userId = "userId";
    const getOtherUsers = true;
    const coords = [0, 0];
    const expectedOffers = [{ id: "123" }, { id: "456" }];
    mockOfferRepository.list.mockResolvedValue(expectedOffers);

    const result = await offerService.listOffers(userId, getOtherUsers, coords);

    expect(mockOfferRepository.list).toHaveBeenCalledWith(
      userId,
      null,
      getOtherUsers,
      coords
    );
    expect(result).toEqual(expectedOffers);
  });

  test("listOffersByHelpedUser should list offers by helped user", async () => {
    const helpedUserId = "helpedUserId";
    const expectedOffers = [{ id: "123" }, { id: "456" }];
    mockOfferRepository.listByHelpedUserId.mockResolvedValue(expectedOffers);

    const result = await offerService.listOffersByHelpedUser(helpedUserId);

    expect(mockOfferRepository.listByHelpedUserId).toHaveBeenCalledWith(
      helpedUserId
    );
    expect(result).toEqual(expectedOffers);
  });

  test("getOfferById should return the offer if it exists", async () => {
    const offerId = "offerId";
    const expectedOffer = { id: offerId };
    mockOfferRepository.getById.mockResolvedValue(expectedOffer);

    const result = await offerService.getOfferById(offerId);

    expect(mockOfferRepository.getById).toHaveBeenCalledWith(offerId);
    expect(result).toEqual(expectedOffer);
  });

  test("getOfferById should throw an error if offer does not exist", async () => {
    mockOfferRepository.getById.mockResolvedValue(null);

    await expect(offerService.getOfferById("123")).rejects.toThrow(
      "Offer not found"
    );
    expect(mockOfferRepository.getById).toHaveBeenCalledWith("123");
  });

  test("addPossibleHelpedUsers should add a user to possibleHelpedUsers list", async () => {
    const helpedUserId = "helpedUserId";
    const offerId = "offerId";
    const mockOffer = {
      _id: offerId,
      ownerId: "ownerId",
      possibleHelpedUsers: [],
      helpedUserId: [],
    };
    const mockUser = { _id: helpedUserId };
    mockOfferRepository.getById.mockResolvedValue(mockOffer);
    mockUserRepository.getById.mockResolvedValue(mockUser);

    const result = await offerService.addPossibleHelpedUsers(
      helpedUserId,
      offerId
    );

    expect(mockOfferRepository.getById).toHaveBeenCalledWith(offerId);
    expect(mockUserRepository.getById).toHaveBeenCalledWith(helpedUserId);
    expect(result.possibleHelpedUsers).toContain(helpedUserId);
  });

  test("addPossibleHelpedUsers should throw an error if user is already in possibleHelpedUsers", async () => {
    const helpedUserId = "helpedUserId";
    const offerId = "offerId";
    const mockOffer = {
      _id: offerId,
      ownerId: "ownerId",
      possibleHelpedUsers: [helpedUserId],
    };
    const mockUser = { _id: helpedUserId };
    mockOfferRepository.getById.mockResolvedValue(mockOffer);
    mockUserRepository.getById.mockResolvedValue(mockUser);

    await expect(
      offerService.addPossibleHelpedUsers(helpedUserId, offerId)
    ).rejects.toThrow("User is already a possible helped user");
    expect(mockOfferRepository.getById).toHaveBeenCalledWith(offerId);
    expect(mockUserRepository.getById).toHaveBeenCalledWith(helpedUserId);
  });

  test("addPossibleHelpedUsers should throw error if user is already in helpedUserId list", async () => {
    const helpedUserId = "helpedUserId";
    const offerId = "offerId";
    const mockOffer = {
      _id: offerId,
      ownerId: "ownerId",
      possibleHelpedUsers: [],
      helpedUserId: [helpedUserId],
    };
    const mockUser = { _id: helpedUserId };
    mockOfferRepository.getById.mockResolvedValue(mockOffer);
    mockUserRepository.getById.mockResolvedValue(mockUser);

    await expect(
      offerService.addPossibleHelpedUsers(helpedUserId, offerId)
    ).rejects.toThrow("Offer already is being helped");

    expect(mockOfferRepository.getById).toHaveBeenCalledWith(offerId);
    expect(mockUserRepository.getById).toHaveBeenCalledWith(helpedUserId);
  });

  test("addPossibleHelpedUsers should throw error if owner tries to add themselves as helped", async () => {
    const ownerId = "ownerId";
    const offerId = "offerId";
    const mockOffer = {
      _id: offerId,
      ownerId: ownerId,
      possibleHelpedUsers: [],
    };
    const mockUser = { _id: ownerId };
    mockOfferRepository.getById.mockResolvedValue(mockOffer);
    mockUserRepository.getById.mockResolvedValue(mockUser);

    await expect(
      offerService.addPossibleHelpedUsers(ownerId, offerId)
    ).rejects.toThrow("Owner of the offer cannot be a helped user");

    expect(mockOfferRepository.getById).toHaveBeenCalledWith(offerId);
    expect(mockUserRepository.getById).toHaveBeenCalledWith(ownerId);
  });

  test("addPossibleHelpedUsers should add user to possibleHelpedUsers list if conditions are met", async () => {
    const helpedUserId = "helpedUserId";
    const offerId = "offerId";
    const mockOffer = {
      _id: offerId,
      ownerId: "ownerId",
      possibleHelpedUsers: [],
      helpedUserId: [],
    };
    const mockUser = { _id: helpedUserId };
    mockOfferRepository.getById.mockResolvedValue(mockOffer);
    mockUserRepository.getById.mockResolvedValue(mockUser);

    const result = await offerService.addPossibleHelpedUsers(
      helpedUserId,
      offerId
    );

    expect(mockOfferRepository.getById).toHaveBeenCalledWith(offerId);
    expect(mockUserRepository.getById).toHaveBeenCalledWith(helpedUserId);
    expect(result.possibleHelpedUsers).toContain(helpedUserId);
  });

  test("addHelpedUsers should add a user to helpedUsers list", async () => {
    const helpedUserId = "helpedUserId";
    const offerId = "offerId";
    const mockOffer = {
      _id: offerId,
      ownerId: "ownerId",
      helpedUsers: [],
      possibleHelpedUsers: [helpedUserId],
    };
    const mockUser = { _id: helpedUserId };
    mockOfferRepository.getById.mockResolvedValue(mockOffer);
    mockUserRepository.getById.mockResolvedValue(mockUser);

    const result = await offerService.addHelpedUsers(helpedUserId, offerId);

    expect(mockOfferRepository.getById).toHaveBeenCalledWith(offerId);
    expect(mockUserRepository.getById).toHaveBeenCalledWith(helpedUserId);
    expect(result.helpedUserId).toContain(helpedUserId);
    expect(result.possibleHelpedUsers).not.toContain(helpedUserId);
  });

  test("addHelpedUsers should throw an error if user is not in possibleHelpedUsers", async () => {
    const helpedUserId = "helpedUserId";
    const offerId = "offerId";
    const mockOffer = {
      _id: offerId,
      ownerId: "ownerId",
      helpedUsers: [],
      possibleHelpedUsers: [],
    };
    const mockUser = { _id: helpedUserId };
    mockOfferRepository.getById.mockResolvedValue(mockOffer);
    mockUserRepository.getById.mockResolvedValue(mockUser);

    await expect(
      offerService.addHelpedUsers(helpedUserId, offerId)
    ).rejects.toThrow("User is not a possible helped user");
    expect(mockOfferRepository.getById).toHaveBeenCalledWith(offerId);
    expect(mockUserRepository.getById).toHaveBeenCalledWith(helpedUserId);
  });

  test("addHelpedUsers should throw an error if owner tries to add themselves as helped", async () => {
    const ownerId = "ownerId";
    const offerId = "offerId";
    const mockOffer = {
      _id: offerId,
      ownerId: ownerId,
      helpedUsers: [],
      possibleHelpedUsers: [ownerId],
    };
    const mockUser = { _id: ownerId };
    mockOfferRepository.getById.mockResolvedValue(mockOffer);
    mockUserRepository.getById.mockResolvedValue(mockUser);

    await expect(offerService.addHelpedUsers(ownerId, offerId)).rejects.toThrow(
      "Owner of the offer cannot be a helped user"
    );
    expect(mockOfferRepository.getById).toHaveBeenCalledWith(offerId);
    expect(mockUserRepository.getById).toHaveBeenCalledWith(ownerId);
  });

  test("addHelpedUsers should throw error if owner tries to add themselves as helped", async () => {
    const ownerId = "ownerId";
    const offerId = "offerId";
    const mockOffer = {
      _id: offerId,
      ownerId: ownerId,
      possibleHelpedUsers: [],
    };
    const mockUser = { _id: ownerId };
    mockOfferRepository.getById.mockResolvedValue(mockOffer);
    mockUserRepository.getById.mockResolvedValue(mockUser);

    await expect(offerService.addHelpedUsers(ownerId, offerId)).rejects.toThrow(
      "Owner of the offer cannot be a helped user"
    );

    expect(mockOfferRepository.getById).toHaveBeenCalledWith(offerId);
    expect(mockUserRepository.getById).toHaveBeenCalledWith(ownerId);
  });

  test("addHelpedUsers should throw an error if offer is already being helped", async () => {
    const helpedUserId = "helpedUserId";
    const offerId = "offerId";
    const mockOffer = {
      _id: offerId,
      ownerId: "ownerId",
      helpedUserId: [helpedUserId],
      possibleHelpedUsers: [],
    };
    const mockUser = { _id: helpedUserId };
    mockOfferRepository.getById.mockResolvedValue(mockOffer);
    mockUserRepository.getById.mockResolvedValue(mockUser);

    await expect(
      offerService.addHelpedUsers(helpedUserId, offerId)
    ).rejects.toThrow("Offer already is being helped");
    expect(mockOfferRepository.getById).toHaveBeenCalledWith(offerId);
    expect(mockUserRepository.getById).toHaveBeenCalledWith(helpedUserId);
  });

  test("finishOfferById should finish the offer if authorized", async () => {
    const offerId = "offerId";
    const ownerUser = { email: "owner@example.com" };
    const mockOffer = { _id: offerId, user: { email: ownerUser.email } };
    mockOfferRepository.findOne.mockResolvedValue(mockOffer);
    mockOfferRepository.finishOffer.mockResolvedValue({
      ...mockOffer,
      active: false,
    });

    const result = await offerService.finishOfferById(offerId, ownerUser);

    expect(mockOfferRepository.findOne).toHaveBeenCalledWith(
      { _id: offerId },
      ["ownerId", "categoryId", "active"],
      { path: "user", select: "email" }
    );
    expect(mockOfferRepository.finishOffer).toHaveBeenCalledWith(mockOffer);
    expect(result.active).toBe(false);
  });

  test("finishOfferById should throw an error if user is not authorized", async () => {
    const offerId = "offerId";
    const ownerUser = { email: "unauthorized@example.com" };
    const mockOffer = { _id: offerId, user: { email: "owner@example.com" } };
    mockOfferRepository.findOne.mockResolvedValue(mockOffer);

    await expect(
      offerService.finishOfferById(offerId, ownerUser)
    ).rejects.toThrow("User not authorized");
    expect(mockOfferRepository.findOne).toHaveBeenCalledWith(
      { _id: offerId },
      ["ownerId", "categoryId", "active"],
      { path: "user", select: "email" }
    );
  });
});
