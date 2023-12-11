const express = require("express");
const controller = require("../controllers/HealthController");

const router = express.Router();

router.get("/health-check", controller.healthCheck);

module.exports = router;
