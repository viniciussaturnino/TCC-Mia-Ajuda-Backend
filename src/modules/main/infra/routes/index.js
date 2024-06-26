const express = require("express");

const healtCheckRoute = require("../../../health/infra/routes/health.routes");
const userRoute = require("../../../user/infra/routes/user.routes");

const router = express.Router();

router.use("/", healtCheckRoute);

router.use("/", userRoute);

module.exports = router;
