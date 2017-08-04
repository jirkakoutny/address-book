const admin = require("firebase-admin");

console.log(`Initializing Firebase on ${process.env.FIREBASE_DB_URL}`);

admin.initializeApp({
    credential: admin.credential.cert({
        "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.FIREBASE_DB_URL
});

const firedb = admin.database();

module.exports = { firedb };