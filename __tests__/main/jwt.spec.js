const jwt = require("jsonwebtoken");
const { generateAuthToken } = require("../../src/modules/main/utils/jwt");
const { JWT_SECRET } = require("../../src/modules/main/config/vars");

jest.mock("jsonwebtoken");

describe("generateAuthToken", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should generate a valid JWT token", () => {
    const mockUser = {
      id: "user_id",
      email: "test@example.com",
    };

    const mockToken = "mock_token";
    jwt.sign.mockReturnValue(mockToken);

    const token = generateAuthToken(mockUser);

    expect(token).toBe(mockToken);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, email: mockUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  test("should throw error if jwt.sign throws error", () => {
    const mockUser = {
      id: "user_id",
      email: "test@example.com",
    };

    const mockError = new Error("JWT sign error");
    jwt.sign.mockImplementation(() => {
      throw mockError;
    });

    expect(() => generateAuthToken(mockUser)).toThrow(mockError);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, email: mockUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  });
});
