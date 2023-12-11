const admin = require("firebase-admin");
const fs = require("fs");

const { FIREBASE_CONFIG_BASE_64 } = require("./vars");

try {
  const buffer = Buffer.from(FIREBASE_CONFIG_BASE_64, "base64");
  fs.writeFileSync("./src/modules/main/config/firebaseAuthConfig.js", buffer);

  // eslint-disable-next-line global-require, import/no-unresolved, import/extensions
  const firebaseAuthConfig = require("./firebaseAuthConfig");

  admin.initializeApp({
    credential: admin.credential.cert(firebaseAuthConfig),
  });

  console.log("Firebase conectado com sucesso!");
} catch (error) {
  console.error("Erro ao conectar ao Firebase!");
  console.error(error);
}

module.exports = admin;
