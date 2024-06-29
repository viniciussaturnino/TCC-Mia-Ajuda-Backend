const express = require("express");
const HelpController = require("../controllers/HelpController");
const verifyToken = require("../../../main/middlewares/authMiddleware");

const helpController = new HelpController();
const routes = express.Router();

routes.post("/help", verifyToken, async (req, res, next) => {
  helpController.createHelp(req, res, next);
});

routes.get("/help/byId/:id", verifyToken, async (req, res, next) => {
  helpController.getHelpById(req, res, next);
});

routes.get("/help/user", verifyToken, async (req, res, next) => {
  helpController.getUserHelps(req, res, next);
});

routes.get("/help/listWaiting", verifyToken, async (req, res, next) => {
  helpController.getWaitingList(req, res, next);
});

routes.get("/help/listbyStatus", verifyToken, async (req, res, next) => {
  helpController.getHelpListByStatus(req, res, next);
});

routes.delete("/help/:id", verifyToken, async (req, res, next) => {
  helpController.deactivateHelp(req, res, next);
});

module.exports = routes;
