/* eslint-disable no-undef */
const HealthService = require("../../modules/health/app/HealthService");

describe("HealthService", () => {
  test("getHealthCheck should return health data", async () => {
    const healthService = new HealthService();
    const healthcheck = await healthService.getHealthCheck();

    expect(healthcheck).toHaveProperty("uptime");
    expect(healthcheck).toHaveProperty("message", "OK");
    expect(healthcheck).toHaveProperty("timestamp");
  });
});
