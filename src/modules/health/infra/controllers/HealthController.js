const HealthService = require("../../app/HealthService");

exports.healthCheck = async (_request, response) => {
  const healthService = new HealthService();

  try {
    const healthcheck = await healthService.getHealthCheck();
    response.status(200).send(healthcheck);
  } catch (error) {
    response.status(503).send({ message: error.message });
  }
};
