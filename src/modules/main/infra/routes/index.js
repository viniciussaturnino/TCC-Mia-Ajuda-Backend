const express = require("express");

const healtCheckRoute = require("../../../health/infra/routes/health.routes");
const userRoute = require("../../../user/infra/routes/user.routes");
const categoryRoute = require("../../../category/infra/routes/category.routes");
const helpRoute = require("../../../help/infra/routes/help.routes");

const router = express.Router();

router.use("/", healtCheckRoute);

router.use("/", userRoute);
router.use("/", categoryRoute);
router.use("/", helpRoute);

module.exports = router;
