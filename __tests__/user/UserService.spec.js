/* eslint-disable no-undef */
const bcrypt = require("bcryptjs");
const UserService = require("../../src/modules/user/app/UserService");
const UserRepository = require("../../src/modules/user/domain/repositories/UserRepository");
const {
  formatCnpj,
  formatCpf,
} = require("../../src/modules/main/utils/processString");
const { generateAuthToken } = require("../../src/modules/main/utils/jwt");
const { PASSWORD_SALT } = require("../../src/modules/main/config/vars");

jest.mock("bcryptjs");
jest.mock("../../src/modules/user/domain/repositories/UserRepository");
jest.mock("../../src/modules/main/utils/processString");
jest.mock("../../src/modules/main/utils/jwt");

describe("UserService", () => {
  let userService;
  let userRepositoryMock;

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
    userService = new UserService();
    userRepositoryMock = new UserRepository();
    userService.userRepository = userRepositoryMock;
  });

  describe("createUser", () => {
    test("should create a user and return user data", async () => {
      const mockPassword = "password123";
      const mockCpf = "131.527.320-90";

      const userData = {
        name: "John Doe",
        password: mockPassword,
        deviceId: "12345abcde",
        email: "johndoe@example.com",
        birthday: "1990-01-01T00:00:00.000Z",
        cpf: mockCpf,
        cnpj: "",
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
        registerDate: "2023-06-17T00:00:00.000Z",
        active: true,
        biography: "This is a sample biography.",
      };

      userRepositoryMock.checkUserExistence.mockResolvedValue(false);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashed_password");
      formatCpf.mockReturnValue("formatted_cpf");
      userRepositoryMock.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(userRepositoryMock.checkUserExistence).toHaveBeenCalledWith(
        userData.email
      );
      expect(bcrypt.genSalt).toHaveBeenCalledWith(parseInt(PASSWORD_SALT));
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, "salt");
      expect(formatCpf).toHaveBeenCalledWith(mockCpf);
      expect(userRepositoryMock.create).toHaveBeenCalledWith({
        ...userData,
        cpf: "formatted_cpf",
        email: userData.email.toLowerCase(),
        password: "hashed_password",
      });
      expect(result).toEqual(mockUser);
    });

    test("should format CNPJ if CPF is not provided and create user", async () => {
      const mockPassword = mockUser.password;
      const mockCnpj = "12.345.678/0001-95";
      const userData = {
        ...mockUser,
        cpf: null,
        cnpj: mockCnpj,
      };

      userRepositoryMock.checkUserExistence.mockResolvedValue(false);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashed_password");
      formatCnpj.mockReturnValue("formatted_cnpj");
      userRepositoryMock.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(userRepositoryMock.checkUserExistence).toHaveBeenCalledWith(
        userData.email
      );
      expect(bcrypt.genSalt).toHaveBeenCalledWith(parseInt(PASSWORD_SALT));
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, "salt");
      expect(formatCnpj).toHaveBeenCalledWith(mockCnpj);
      expect(userRepositoryMock.create).toHaveBeenCalledWith({
        ...userData,
        cnpj: "formatted_cnpj",
        email: userData.email.toLowerCase(),
        password: "hashed_password",
      });
      expect(result).toEqual(mockUser);
    });

    test("should throw error if CPF or CNPJ is missing", async () => {
      const userData = {
        name: "John Doe",
        password: "password123",
        deviceId: "12345abcde",
        email: "johndoe@example.com",
      };

      await expect(userService.createUser(userData)).rejects.toThrow(
        "CPF or CNPJ is required."
      );
    });

    test("should throw error if user already exists", async () => {
      const userData = {
        name: "John Doe",
        password: "password123",
        deviceId: "12345abcde",
        email: "johndoe@example.com",
        cpf: "131.527.320-90",
      };

      userRepositoryMock.checkUserExistence.mockResolvedValue(true);

      await expect(userService.createUser(userData)).rejects.toThrow(
        "User already exists."
      );
    });

    test("should throw error if password is invalid", async () => {
      const userData = {
        name: "John Doe",
        password: "short",
        deviceId: "12345abcde",
        email: "johndoe@example.com",
        cpf: "131.527.320-90",
      };

      await expect(userService.createUser(userData)).rejects.toThrow(
        "Invalid password."
      );
    });
  });

  describe("getUsers", () => {
    test("should return a list of users", async () => {
      const mockUsers = [
        { ...mockUser, id: 1, name: "User 1" },
        { ...mockUser, id: 2, name: "User 2" },
      ];
      userRepositoryMock.get.mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      expect(result).toEqual(mockUsers);
    });

    test("should throw an error if userRepository.get throws an error", async () => {
      const errorMessage = "Database error";
      userRepositoryMock.get.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      try {
        await userService.getUsers();
        expect(true).toBe(false);
      } catch (err) {
        expect(err.message).toBe(errorMessage);
      }

      expect(userRepositoryMock.get).toHaveBeenCalled();
    });
  });

  describe("getUserByEmail", () => {
    test("should return a user by email", async () => {
      userRepositoryMock.getUserByEmail.mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail("johndoe@example.com");

      expect(result).toEqual(mockUser);
    });

    test("should throw an error if userRepository.getUserByEmail throws an error", async () => {
      const errorMessage = "Database error";
      userRepositoryMock.getUserByEmail.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      try {
        await userService.getUserByEmail("johndoe@example.com");
        expect(true).toBe(false);
      } catch (err) {
        expect(err.message).toBe(errorMessage);
      }

      expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith(
        "johndoe@example.com"
      );
    });
  });

  describe("getUserById", () => {
    test("should return a user by id", async () => {
      userRepositoryMock.getById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(result).toEqual(mockUser);
    });

    test("should throw an error if userRepository.getById throws an error", async () => {
      const errorMessage = "Database error";
      const userId = 1;
      userRepositoryMock.getById.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      try {
        await userService.getUserById(userId);
        expect(true).toBe(false);
      } catch (err) {
        expect(err.message).toBe(errorMessage);
      }

      expect(userRepositoryMock.getById).toHaveBeenCalledWith(userId);
    });
  });

  describe("updateUserById", () => {
    test("should update user data when all fields are provided", async () => {
      const mockUserId = 1;
      const updatedUserData = {
        email: "updated@example.com",
        photo: "https://example.com/updated_photo.jpg",
        name: "Updated User",
        phone: "+5511999999999",
        notificationToken: "updated_token",
        address: {
          cep: "12345-678",
          number: 456,
          city: "Rio de Janeiro",
          state: "RJ",
          complement: "House 789",
        },
        biography: "Updated biography",
        location: { long: -46.633309, lat: -23.55052 },
      };

      const userData = { ...mockUser, id: mockUserId };
      userRepositoryMock.getById.mockResolvedValue(userData);
      userRepositoryMock.update.mockResolvedValue(userData);

      const result = await userService.updateUserById(
        mockUserId,
        updatedUserData
      );

      expect(userRepositoryMock.getById).toHaveBeenCalledWith(mockUserId);
      expect(userRepositoryMock.update).toHaveBeenCalledWith({
        ...userData,
        ...updatedUserData,
        address: { ...userData.address, ...updatedUserData.address },
        location: { ...userData.location, ...updatedUserData.location },
      });
      expect(result).toEqual({ ...userData, ...updatedUserData });
    });

    test("should update user data when only some fields are provided", async () => {
      const mockUserId = 1;
      const updatedUserData = {
        email: "updated@example.com",
      };

      const userData = { ...mockUser, id: mockUserId };
      userRepositoryMock.getById.mockResolvedValue(userData);
      userRepositoryMock.update.mockResolvedValue(userData);

      const result = await userService.updateUserById(
        mockUserId,
        updatedUserData
      );

      expect(userRepositoryMock.getById).toHaveBeenCalledWith(mockUserId);
      expect(userRepositoryMock.update).toHaveBeenCalledWith({
        ...userData,
        ...updatedUserData,
      });
      expect(result).toEqual({ ...userData, ...updatedUserData });
    });

    test("should update user data when only name field is provided", async () => {
      const mockUserId = 1;
      const updatedUserData = {
        name: "New Name",
      };

      const userData = { ...mockUser, id: mockUserId };
      userRepositoryMock.getById.mockResolvedValue(userData);
      userRepositoryMock.update.mockResolvedValue(userData);

      const result = await userService.updateUserById(
        mockUserId,
        updatedUserData
      );

      expect(userRepositoryMock.getById).toHaveBeenCalledWith(mockUserId);
      expect(userRepositoryMock.update).toHaveBeenCalledWith({
        ...userData,
        ...updatedUserData,
      });
      expect(result).toEqual({ ...userData, ...updatedUserData });
    });
  });

  describe("updateUserAddressById", () => {
    test("should update user address when all fields are provided", async () => {
      const mockUserId = 1;
      const updatedAddressData = {
        cep: "98765-432",
        number: 456,
        city: "Rio de Janeiro",
        state: "RJ",
        complement: "House 789",
      };

      const userData = { ...mockUser, id: mockUserId };
      userRepositoryMock.getById.mockResolvedValue(userData);
      userRepositoryMock.update.mockResolvedValue(userData);

      const result = await userService.updateUserAddressById(
        mockUserId,
        updatedAddressData
      );

      expect(userRepositoryMock.getById).toHaveBeenCalledWith(mockUserId);
      expect(userRepositoryMock.update).toHaveBeenCalledWith({
        ...userData,
        address: { ...userData.address, ...updatedAddressData },
      });
      expect(result).toEqual({
        ...userData,
        address: { ...userData.address, ...updatedAddressData },
      });
    });

    test("should update user address when only some fields are provided", async () => {
      const mockUserId = 1;
      const updatedAddressData = {
        city: "Rio de Janeiro",
      };

      const userData = { ...mockUser, id: mockUserId };
      userRepositoryMock.getById.mockResolvedValue(userData);
      userRepositoryMock.update.mockResolvedValue(userData);

      const result = await userService.updateUserAddressById(
        mockUserId,
        updatedAddressData
      );

      expect(userRepositoryMock.getById).toHaveBeenCalledWith(mockUserId);
      expect(userRepositoryMock.update).toHaveBeenCalledWith({
        ...userData,
        address: {
          ...userData.address,
          city: updatedAddressData.city,
        },
      });
      expect(result).toEqual({
        ...userData,
        address: {
          ...userData.address,
          city: updatedAddressData.city,
        },
      });
    });

    test("should update user address when only state field is provided", async () => {
      const mockUserId = 1;
      const updatedAddressData = {
        state: "DF",
      };

      const userData = { ...mockUser, id: mockUserId };
      userRepositoryMock.getById.mockResolvedValue(userData);
      userRepositoryMock.update.mockResolvedValue(userData);

      const result = await userService.updateUserAddressById(
        mockUserId,
        updatedAddressData
      );

      expect(userRepositoryMock.getById).toHaveBeenCalledWith(mockUserId);
      expect(userRepositoryMock.update).toHaveBeenCalledWith({
        ...userData,
        address: {
          ...userData.address,
          state: updatedAddressData.state,
        },
      });
      expect(result).toEqual({
        ...userData,
        address: {
          ...userData.address,
          state: updatedAddressData.state,
        },
      });
    });
  });

  describe("updateUserLocationById", () => {
    test("should update user location by id and return updated user", async () => {
      const mockUser = {
        id: 1,
        location: { coordinates: [-46.633309, -23.55052] },
      };
      const updatedLocationData = {
        long: -44.5,
        lat: -22.4,
      };

      userRepositoryMock.getById.mockResolvedValue(mockUser);
      userRepositoryMock.update.mockResolvedValue({
        ...mockUser,
        location: {
          ...mockUser.location,
          coordinates: [updatedLocationData.long, updatedLocationData.lat],
        },
      });

      const result = await userService.updateUserLocationById(
        1,
        updatedLocationData
      );

      expect(userRepositoryMock.getById).toHaveBeenCalledWith(1);
      expect(userRepositoryMock.update).toHaveBeenCalledWith({
        ...mockUser,
        location: {
          ...mockUser.location,
          coordinates: [updatedLocationData.long, updatedLocationData.lat],
        },
      });
      expect(result).toEqual({
        ...mockUser,
        location: {
          ...mockUser.location,
          coordinates: [updatedLocationData.long, updatedLocationData.lat],
        },
      });
    });

    test("should update user location by id with valid long", async () => {
      const mockUser = {
        id: 1,
        location: { coordinates: [-46.633309, -23.55052] },
      };

      const updatedLocationData = {
        long: -46.62,
        lat: undefined,
      };

      userRepositoryMock.getById.mockResolvedValue(mockUser);
      userRepositoryMock.update.mockResolvedValue({
        ...mockUser,
        location: {
          coordinates: [
            updatedLocationData.long,
            mockUser.location.coordinates[1],
          ],
        },
      });

      const result = await userService.updateUserLocationById(
        1,
        updatedLocationData
      );

      expect(userRepositoryMock.getById).toHaveBeenCalledWith(1);
      expect(userRepositoryMock.update).toHaveBeenCalledWith({
        ...mockUser,
        location: {
          coordinates: [
            updatedLocationData.long,
            mockUser.location.coordinates[1],
          ],
        },
      });
      expect(result).toEqual({
        ...mockUser,
        location: {
          coordinates: [
            updatedLocationData.long,
            mockUser.location.coordinates[1],
          ],
        },
      });
    });

    test("should update user location by id with valid lat", async () => {
      const mockUser = {
        id: 1,
        location: { coordinates: [-46.633309, -23.55052] },
      };

      const updatedLocationData = {
        long: undefined,
        lat: -23.55,
      };

      userRepositoryMock.getById.mockResolvedValue(mockUser);
      userRepositoryMock.update.mockResolvedValue({
        ...mockUser,
        location: {
          coordinates: [
            mockUser.location.coordinates[0],
            updatedLocationData.lat,
          ],
        },
      });

      const result = await userService.updateUserLocationById(
        1,
        updatedLocationData
      );

      expect(userRepositoryMock.getById).toHaveBeenCalledWith(1);
      expect(userRepositoryMock.update).toHaveBeenCalledWith({
        ...mockUser,
        location: {
          coordinates: [
            mockUser.location.coordinates[0],
            updatedLocationData.lat,
          ],
        },
      });
      expect(result).toEqual({
        ...mockUser,
        location: {
          coordinates: [
            mockUser.location.coordinates[0],
            updatedLocationData.lat,
          ],
        },
      });
    });

    test("should not update user location by id if long and lat are undefined", async () => {
      const mockUser = {
        id: 1,
        location: { coordinates: [-46.633309, -23.55052] },
      };

      const updatedLocationData = {
        long: undefined,
        lat: undefined,
      };

      userRepositoryMock.getById.mockResolvedValue(mockUser);
      userRepositoryMock.update.mockResolvedValue({
        ...mockUser,
      });

      const result = await userService.updateUserLocationById(
        1,
        updatedLocationData
      );

      expect(userRepositoryMock.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe("login", () => {
    test("should login user and return auth token", async () => {
      const loginData = {
        email: "johndoe@example.com",
        password: "password123",
      };

      userRepositoryMock.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      generateAuthToken.mockReturnValue("auth_token");

      const result = await userService.login(loginData);

      expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith(
        loginData.email
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password
      );
      expect(generateAuthToken).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ authToken: "auth_token" });
    });

    test("should throw error if user not found", async () => {
      const loginData = {
        email: "johndoe@example.com",
        password: "password123",
      };

      userRepositoryMock.getUserByEmail.mockResolvedValue(null);

      await expect(userService.login(loginData)).rejects.toThrow(
        "User not found."
      );
    });

    test("should throw error if password is invalid", async () => {
      const loginData = {
        email: "johndoe@example.com",
        password: "wrong_password",
      };

      userRepositoryMock.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(userService.login(loginData)).rejects.toThrow(
        "Invalid password."
      );
    });
  });
});
