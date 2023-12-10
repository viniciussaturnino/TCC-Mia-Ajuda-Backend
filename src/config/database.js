/* eslint-disable no-console */
const mongoose = require("mongoose");

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

const databaseConnect = async () => {
  try {
    mongoose.connect(
      `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
      {
        useNewUrlParser: true,
      },
    );
    console.log("Conectado ao banco de dados com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados!");
    console.error(error);
  }
};

module.exports = databaseConnect;
