const app = require("./src/modules/main/config/express");

const { API_PORT } = require("./src/modules/main/config/vars");

const databaseConnect = require("./src/modules/main/config/database");

databaseConnect();

app.listen(API_PORT, () =>
  console.log(`Servidor rodando na porta ${API_PORT}!`),
);

module.exports = app;
