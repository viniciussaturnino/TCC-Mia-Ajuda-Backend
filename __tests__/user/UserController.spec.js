const UserController = require("../../src/modules/user/infra/controllers/UserController");
const UserService = require("../../src/modules/user/app/UserService");

jest.mock("../../src/modules/user/app/UserService");

describe("UserController", () => {
  let userController;
  let mockRequest;
  let mockResponse;
  let mockNext;

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

  beforeEach(() => {
    userController = new UserController();
    mockRequest = {
      body: {},
      query: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("createUser", () => {
    test("should create a user and return status 201", async () => {
      UserService.prototype.createUser.mockResolvedValueOnce(mockUser);
      mockRequest.body = { name: "John Doe" };

      await userController.createUser(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      UserService.prototype.createUser.mockRejectedValueOnce(
        new Error("Test error")
      );

      await userController.createUser(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getUsers", () => {
    test("should get users and return status 200", async () => {
      const mockUsers = [
        { ...mockUser, id: 1, name: "User 1" },
        { ...mockUser, id: 2, name: "User 2" },
      ];
      UserService.prototype.getUsers.mockResolvedValueOnce(mockUsers);

      await userController.getUsers(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      UserService.prototype.getUsers.mockRejectedValueOnce(
        new Error("Test error")
      );

      await userController.getUsers(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getUserByEmail", () => {
    test("should get user by email and return status 200", async () => {
      UserService.prototype.getUserByEmail.mockResolvedValueOnce(mockUser);
      mockRequest.query.email = "johndoe@example.com";

      await userController.getUserByEmail(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ...mockUser,
        email: "johndoe@example.com",
      });
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      UserService.prototype.getUserByEmail.mockRejectedValueOnce(
        new Error("Test error")
      );

      await userController.getUserByEmail(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    test("should get user by id and return status 200", async () => {
      UserService.prototype.getUserById.mockResolvedValueOnce(mockUser);
      mockRequest.params.id = 1;

      await userController.getUserById(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      UserService.prototype.getUserById.mockRejectedValueOnce(
        new Error("Test error")
      );

      await userController.getUserById(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("updateUserById", () => {
    test("should update user by id and return status 200", async () => {
      UserService.prototype.updateUserById.mockResolvedValueOnce(mockUser);
      mockRequest.params.id = 1;
      mockRequest.body = {
        email: "updated@example.com",
        photo: "https://example.com/updated_photo.jpg",
        name: "Updated User",
        phone: "+5511999999999",
        notificationToken: "updated_token",
        deviceId: "updated_device",
        address: {
          cep: "12345-678",
          number: 123,
          city: "São Paulo",
          state: "SP",
          complement: "Apartment 456",
        },
        biography: "Updated biography",
        location: { long: -46.633309, lat: -23.55052 },
      };

      await userController.updateUserById(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      UserService.prototype.updateUserById.mockRejectedValueOnce(
        new Error("Test error")
      );

      await userController.updateUserById(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("updateUserAddressById", () => {
    test("should update user address by id and return status 200", async () => {
      UserService.prototype.updateUserAddressById.mockResolvedValueOnce(
        mockUser
      );
      mockRequest.params.id = 1;
      mockRequest.body = {
        cep: "12345-678",
        number: 123,
        city: "São Paulo",
        state: "SP",
        complement: "Apartment 456",
      };

      await userController.updateUserAddressById(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      UserService.prototype.updateUserAddressById.mockRejectedValueOnce(
        new Error("Test error")
      );

      await userController.updateUserAddressById(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("updateUserLocationById", () => {
    test("should update user location by id and return status 200", async () => {
      const mockUser = {
        id: 1,
        location: { long: -46.633309, lat: -23.55052 },
      };
      UserService.prototype.updateUserLocationById.mockResolvedValueOnce(
        mockUser
      );
      mockRequest.params.id = 1;
      mockRequest.body = {
        long: -46.633309,
        lat: -23.55052,
      };

      await userController.updateUserLocationById(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      UserService.prototype.updateUserLocationById.mockRejectedValueOnce(
        new Error("Test error")
      );

      await userController.updateUserLocationById(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    test("should login user and return status 200", async () => {
      const mockUser = { id: 1, token: "login_token" };
      UserService.prototype.login.mockResolvedValueOnce(mockUser);
      mockRequest.body = {
        email: "johndoe@example.com",
        password: "password123",
      };

      await userController.login(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should return status 400 on error", async () => {
      UserService.prototype.login.mockRejectedValueOnce(
        new Error("Test error")
      );

      await userController.login(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
