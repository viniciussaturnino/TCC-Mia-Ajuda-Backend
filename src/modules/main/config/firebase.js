const admin = require("firebase-admin");

const firebaseAuthConfig = require("./firebaseAuthConfig");

try {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAuthConfig),
  });

  console.log("Firebase conectado com sucesso!");
} catch (error) {
  console.error("Erro ao conectar ao Firebase!");
  console.error(error);
}

module.exports = admin;
