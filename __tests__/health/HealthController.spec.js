/* eslint-disable no-undef */
const {
  healthCheck,
} = require("../../src/modules/health/infra/controllers/HealthController");
const HealthService = require("../../src/modules/health/app/HealthService");

jest.mock("../../src/modules/health/app/HealthService");

describe("healthCheck Controller", () => {
  test("should return health data with status 200", async () => {
    const mockHealthcheck = {
      uptime: 100,
      message: "OK",
      timestamp: Date.now(),
    };

    HealthService.prototype.getHealthCheck.mockResolvedValueOnce(
      mockHealthcheck,
    );

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await healthCheck({}, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith(mockHealthcheck);
  });

  test("should return status 503 on error", async () => {
    HealthService.prototype.getHealthCheck.mockRejectedValueOnce(
      new Error("Test error"),
    );

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await healthCheck({}, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(503);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: "Test error" });
  });
});
