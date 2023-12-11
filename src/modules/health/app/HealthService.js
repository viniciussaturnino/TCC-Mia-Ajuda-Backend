const { format, addSeconds } = require("date-fns");
const HealthCheck = require("../domain/HealthCheck");

class HealthService {
  async getHealthCheck() {
    const now = new Date(0);

    const uptime = format(addSeconds(now, process.uptime()), "HH:mm:ss");
    const message = "OK";
    const timestamp = format(Date.now(), "yyyy-MM-dd HH:mm:ss");

    const healthCheck = new HealthCheck(uptime, message, timestamp);

    return healthCheck;
  }
}

module.exports = HealthService;
