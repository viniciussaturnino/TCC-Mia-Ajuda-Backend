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

routes.get("/help", verifyToken, async (req, res, next) => {
  helpController.getHelps(req, res, next);
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

routes.put("/help/possibleHelpers", verifyToken, async (req, res, next) => {
  helpController.addPossibleHelpers(req, res, next);
});

routes.put("/help/chooseHelper", verifyToken, async (req, res, next) => {
  helpController.chooseHelper(req, res, next);
});

routes.put("/help/helperConfirmation", verifyToken, async (req, res, next) => {
  helpController.helperConfirmation(req, res, next);
});

routes.put("/help/ownerConfirmation", verifyToken, async (req, res, next) => {
  helpController.ownerConfirmation(req, res, next);
});

module.exports = routes;
