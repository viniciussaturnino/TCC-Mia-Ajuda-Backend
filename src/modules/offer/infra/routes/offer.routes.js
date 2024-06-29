const express = require("express");
const OfferController = require("../controllers/OfferController");
const verifyToken = require("../../../main/middlewares/authMiddleware");

const offerController = new OfferController();
const routes = express.Router();

routes.post("/offer", verifyToken, async (req, res, next) => {
  offerController.createOffer(req, res, next);
});

routes.get("/offer/byId/:id", verifyToken, async (req, res, next) => {
  offerController.getOfferById(req, res, next);
});

routes.get("/offer/list", verifyToken, async (req, res, next) => {
  offerController.listOffers(req, res, next);
});

routes.get(
  "/offer/listByHelpedUser/:id",
  verifyToken,
  async (req, res, next) => {
    offerController.listOffersByHelpedUser(req, res, next);
  }
);

routes.put("/offer/possibleHelpedUsers", verifyToken, (req, res, next) => {
  offerController.addPossibleHelpedUsers(req, res, next);
});

routes.put("/offer/chooseHelpedUsers", verifyToken, (req, res, next) => {
  offerController.chooseHelpedUsers(req, res, next);
});

routes.delete("/offer/:offerId", verifyToken, async (req, res, next) => {
  offerController.finishOffer(req, res, next);
});

module.exports = routes;
