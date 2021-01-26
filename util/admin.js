const admin = require("firebase-admin");

const data = process.env.KEY_JSON;
const jsonCredential = JSON.parse(data);

admin.initializeApp({
  credential: admin.credential.cert(jsonCredential),
  storageBucket: process.env.STORAGE_BUCKET,
});

module.exports = { admin };
