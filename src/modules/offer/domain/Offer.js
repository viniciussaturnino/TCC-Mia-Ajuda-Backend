const OfferRepository = require("./repositories/OfferRepository");

class Offer {
  constructor() {
    this.offerRepository = new OfferRepository();
  }
}

module.exports = Offer;
