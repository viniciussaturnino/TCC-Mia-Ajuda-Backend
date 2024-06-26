const mongoose = require("mongoose");
const { cpf, cnpj } = require("cpf-cnpj-validator");
const { validate } = require("email-validator");

const riskGroupsEnum = {
  dc: "dc", // Doença respiratória
  hiv: "hiv", // HIV
  diab: "diab", // Diabetes
  hiperT: "hiperT", // Hipertensão
  doenCardio: "doenCardio", // Doenças cardiovasculares
};

const Point = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        validator: (v) => validate(v),
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    birthday: {
      type: Date,
      required: true,
    },
    cpf: {
      type: String,
      required: false,
      unique: true,
      index: true,
      validate: {
        validator: (v) => cpf.isValid(v),
        message: (props) => `${props.value} is not a valid cpf`,
      },
    },
    cnpj: {
      type: String,
      required: false,
      unique: true,
      index: true,
      validate: {
        validator: (v) => cnpj.isValid(v),
        message: (props) => `${props.value} is not a valid cnpj`,
      },
    },
    riskGroup: {
      type: [String],
      enum: [...Object.keys(riskGroupsEnum)],
    },
    photo: {
      type: String,
    },
    notificationToken: {
      type: String,
    },
    address: {
      cep: {
        type: String,
      },
      number: {
        type: Number,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      complement: String,
    },
    ismentalHealthProfessional: {
      type: Boolean,
      default: false,
      required: false,
    },
    location: {
      type: Point,
      index: "2dsphere",
    },
    phone: {
      type: String,
    },
    registerDate: {
      type: Date,
      default: Date.now,
    },
    active: {
      default: true,
      type: Boolean,
    },
    biography: {
      type: String,
      default: "-",
    },
  },
  { collection: "user" }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
