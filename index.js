/* eslint-disable no-console */
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const databaseConnect = require("./src/config/database");

const app = express();

app.use(cors());

databaseConnect();

app.listen(process.env.API_PORT || 8000, () =>
  console.log(`Servidor rodando na porta ${process.env.API_PORT || 8000}!`),
);
