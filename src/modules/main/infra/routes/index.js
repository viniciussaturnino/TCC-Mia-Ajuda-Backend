const express = require("express");

const healtCheckRoute = require("../../../health/infra/routes/health.routes");

const router = express.Router();

router.use("/", healtCheckRoute);

module.exports = router;
