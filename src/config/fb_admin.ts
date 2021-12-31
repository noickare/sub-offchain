import admin from "firebase-admin";

var serviceAccount = require("./fb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export { admin }
