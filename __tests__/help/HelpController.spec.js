const HelpController = require("../../src/modules/help/infra/controllers/HelpController");
const HelpService = require("../../src/modules/help/app/HelpService");
const UserService = require("../../src/modules/user/app/UserService");

jest.mock("../../src/modules/help/app/HelpService");
jest.mock("../../src/modules/user/app/UserService");

describe("HelpController", () => {
  let helpController;
  let mockRequest;
  let mockResponse;
  let mockNext;

  const mockHelp = {
    id: 1,
    title: "Help Request",
    description: "Need assistance with groceries",
    ownerId: 1,
    status: "waiting",
    categoryId: ["1", "2"],
    location: {
      type: "Point",
      coordinates: [-46.633309, -23.55052],
      id: 1,
    },
  };

  beforeEach(() => {
    helpController = new HelpController();
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

  describe("createHelp", () => {
    test("should create a help request with success", async () => {
      HelpService.prototype.createHelp.mockResolvedValueOnce(mockHelp);
      mockRequest.body = { title: "Help Request" };

      await helpController.createHelp(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockHelp);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      HelpService.prototype.createHelp.mockRejectedValueOnce(
        new Error("Test error")
      );

      await helpController.createHelp(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getUserHelps", () => {
    test("should get user's helps with success", async () => {
      const mockHelps = [mockHelp];
      HelpService.prototype.getUserHelps.mockResolvedValueOnce(mockHelps);

      await helpController.getUserHelps(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockHelps);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      HelpService.prototype.getUserHelps.mockRejectedValueOnce(
        new Error("Test error")
      );

      await helpController.getUserHelps(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getHelpById", () => {
    test("should get help by id with success", async () => {
      HelpService.prototype.getHelpWithAggregationById.mockResolvedValueOnce(
        mockHelp
      );
      mockRequest.params.id = 1;

      await helpController.getHelpById(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockHelp);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      HelpService.prototype.getHelpWithAggregationById.mockRejectedValueOnce(
        new Error("Test error")
      );

      await helpController.getHelpById(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getWaitingList", () => {
    test("should get waiting list with success", async () => {
      const mockWaitingList = [mockHelp];
      HelpService.prototype.getWaitingList.mockResolvedValueOnce(
        mockWaitingList
      );
      mockRequest.query.coords = "-46.633309,-23.55052";
      mockRequest.query.categoryId = "1,2";

      await helpController.getWaitingList(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockWaitingList);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 if coordinates are missing", async () => {
      await helpController.getWaitingList(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Coordinates are required",
      });
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      HelpService.prototype.getWaitingList.mockRejectedValueOnce(
        new Error("Test error")
      );
      mockRequest.query.coords = "-46.633309,-23.55052";

      await helpController.getWaitingList(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getHelpListByStatus", () => {
    test("should get help list by status with success", async () => {
      const mockHelps = [mockHelp];
      HelpService.prototype.getHelpListByStatus.mockResolvedValueOnce(
        mockHelps
      );
      mockRequest.query.statusList = "waiting,on_going";

      await helpController.getHelpListByStatus(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockHelps);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 if statusList is missing", async () => {
      await helpController.getHelpListByStatus(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Status List is required",
      });
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      HelpService.prototype.getHelpListByStatus.mockRejectedValueOnce(
        new Error("Test error")
      );
      mockRequest.query.statusList = "waiting,on_going";

      await helpController.getHelpListByStatus(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("deactivateHelp", () => {
    test("should deactivate help by id with success", async () => {
      HelpService.prototype.deactivateHelp.mockResolvedValueOnce(mockHelp);
      mockRequest.params.id = 1;

      await helpController.deactivateHelp(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockHelp);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      HelpService.prototype.deactivateHelp.mockRejectedValueOnce(
        new Error("Test error")
      );

      await helpController.deactivateHelp(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
