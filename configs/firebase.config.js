const admin = require("firebase-admin");

const serviceAccount = require("../firebase-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jusgo-6bbef-default-rtdb.firebaseio.com",
});

module.exports = admin;