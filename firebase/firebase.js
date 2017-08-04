const admin = require("firebase-admin");

const serviceAccount = require("../config/firebase.json");

console.log(`Initializing Firebase on ${process.env.FIREBASE_DB_URL}`);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL
});

const firedb = admin.database();

module.exports = { firedb };