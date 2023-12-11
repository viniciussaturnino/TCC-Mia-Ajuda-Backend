class HealthCheck {
  constructor(uptime, message, timestamp) {
    this.uptime = uptime;
    this.message = message;
    this.timestamp = timestamp;
  }
}

module.exports = HealthCheck;
