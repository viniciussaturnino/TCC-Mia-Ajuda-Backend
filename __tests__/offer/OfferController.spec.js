const OfferController = require("../../src/modules/offer/infra/controllers/OfferController");
const OfferService = require("../../src/modules/offer/app/OfferService");

jest.mock("../../src/modules/offer/app/OfferService");

describe("OfferController", () => {
  let offerController;
  let mockRequest;
  let mockResponse;
  let mockNext;

  const mockOffer = {
    id: 1,
    title: "Offer Title",
    description: "Offer description",
    ownerId: 1,
    helpedUserId: 2,
    status: "active",
    location: {
      type: "Point",
      coordinates: [-46.633309, -23.55052],
      id: 1,
    },
  };

  beforeEach(() => {
    offerController = new OfferController();
    mockRequest = {
      body: {},
      query: {},
      params: {},
      user: {
        id: 1,
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("createOffer", () => {
    test("should create an offer with success", async () => {
      OfferService.prototype.createOffer.mockResolvedValueOnce(mockOffer);
      mockRequest.body = { title: "Offer Title" };

      await offerController.createOffer(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOffer);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      OfferService.prototype.createOffer.mockRejectedValueOnce(
        new Error("Test error")
      );

      await offerController.createOffer(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getOfferById", () => {
    test("should get offer by id with success", async () => {
      OfferService.prototype.getOfferWithAggregationById.mockResolvedValueOnce(
        mockOffer
      );
      mockRequest.params.id = 1;

      await offerController.getOfferById(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOffer);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      OfferService.prototype.getOfferWithAggregationById.mockRejectedValueOnce(
        new Error("Test error")
      );

      await offerController.getOfferById(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("listOffers", () => {
    test("should list offers with success", async () => {
      const mockOffers = [mockOffer];
      OfferService.prototype.listOffers.mockResolvedValueOnce(mockOffers);

      await offerController.listOffers(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOffers);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      OfferService.prototype.listOffers.mockRejectedValueOnce(
        new Error("Test error")
      );

      await offerController.listOffers(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("listOffersByHelpedUser", () => {
    test("should list offers by helped user with success", async () => {
      const mockOffers = [mockOffer];
      OfferService.prototype.listOffersByHelpedUser.mockResolvedValueOnce(
        mockOffers
      );
      mockRequest.params.helpedUserId = 2;

      await offerController.listOffersByHelpedUser(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOffers);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      OfferService.prototype.listOffersByHelpedUser.mockRejectedValueOnce(
        new Error("Test error")
      );
      mockRequest.params.helpedUserId = 2;

      await offerController.listOffersByHelpedUser(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("addPossibleHelpedUsers", () => {
    test("should add possible helped users with success", async () => {
      OfferService.prototype.addPossibleHelpedUsers.mockResolvedValueOnce(
        mockOffer
      );
      mockRequest.body = { helpedUserId: 2, offerId: 1 };

      await offerController.addPossibleHelpedUsers(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOffer);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      OfferService.prototype.addPossibleHelpedUsers.mockRejectedValueOnce(
        new Error("Test error")
      );

      await offerController.addPossibleHelpedUsers(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("chooseHelpedUsers", () => {
    test("should choose helped users with success", async () => {
      OfferService.prototype.addHelpedUsers.mockResolvedValueOnce(mockOffer);
      mockRequest.body = { helpedUserId: 2, offerId: 1 };

      await offerController.chooseHelpedUsers(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOffer);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      OfferService.prototype.addHelpedUsers.mockRejectedValueOnce(
        new Error("Test error")
      );

      await offerController.chooseHelpedUsers(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("finishOffer", () => {
    test("should finish offer with success", async () => {
      OfferService.prototype.finishOfferById.mockResolvedValueOnce(mockOffer);
      mockRequest.params.offerId = 1;

      await offerController.finishOffer(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOffer);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      OfferService.prototype.finishOfferById.mockRejectedValueOnce(
        new Error("Test error")
      );

      await offerController.finishOffer(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
