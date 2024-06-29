/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const supertest = require("supertest");
const verifyToken = require("../../src/modules/main/middlewares/authMiddleware");
const UserRepository = require("../../src/modules/user/domain/repositories/UserRepository");
const { JWT_SECRET } = require("../../src/modules/main/config/vars");

jest.mock("jsonwebtoken");
jest.mock("../../src/modules/user/domain/repositories/UserRepository");

const mockRequest = () => {
  return {
    headers: {},
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authMiddleware middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should set req.user if valid token and user found", async () => {
    req.headers.authorization = "Bearer valid_token";

    const mockUser = { id: 1, username: "test_user" };

    jwt.verify.mockImplementationOnce((token, secret, callback) => {
      callback(null, { id: 1 });
    });

    UserRepository.mockImplementationOnce(() => ({
      getById: jest.fn().mockResolvedValue(mockUser),
    }));

    await verifyToken(req, res, next);

    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  test("should return 401 if no auth token provided", async () => {
    req.headers.authorization = null;

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Auth Token not provided.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if invalid token provided", async () => {
    req.headers.authorization = "Bearer invalid_token";

    jwt.verify.mockImplementationOnce((token, secret, callback) => {
      callback("Invalid token.");
    });

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token." });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if user not found", async () => {
    req.headers.authorization = "Bearer valid_token";

    jwt.verify.mockImplementationOnce((token, secret, callback) => {
      callback(null, { id: "user_id" });
    });

    UserRepository.mockImplementationOnce(() => ({
      getById: jest.fn().mockResolvedValue(null), // Simulate user not found
    }));

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found." });
    expect(next).not.toHaveBeenCalled();
  });
});
