const mongoose = require("mongoose");
const helpStatusEnum = require("../../infra/enums/helpStatusEnum");
const Point = require("../../../main/infra/models/Point");
const { calculateDistance } = require("../../../main/utils/distance");

const helpSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 300,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(helpStatusEnum),
      default: helpStatusEnum.WAITING,
    },
    possibleHelpers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    categoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    helperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
    finishedDate: {
      type: Date,
      required: false,
    },
    active: {
      default: true,
      type: Boolean,
    },
    location: {
      type: Point,
      index: "2dsphere",
      required: false,
    },
  },
  {
    collection: "help",
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

helpSchema.virtual("categories", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
});
helpSchema.virtual("user", {
  ref: "User",
  localField: "ownerId",
  foreignField: "_id",
  justOne: true,
});

helpSchema.virtual("distances").set(({ userCoords, coords }) => {
  userCoords = {
    longitude: userCoords[0],
    latitude: userCoords[1],
  };
  const coordinates = {
    longitude: coords[0],
    latitude: coords[1],
  };
  this.distance = calculateDistance(coordinates, userCoords);
});

helpSchema.virtual("distance").get(() => this.distance);

helpSchema.virtual("type").get(() => "help");

module.exports = mongoose.model("Help", helpSchema);
