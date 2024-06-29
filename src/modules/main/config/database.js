const mongoose = require("mongoose");

const { DATABASE_URL } = require("./vars");
const CategorySeed = require("../config/seeds/CategorySeed");

const databaseConnect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado ao banco de dados com sucesso!");

    await CategorySeed();
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados!");
    console.error(error);
  }
};

module.exports = databaseConnect;
