const firebase = require('firebase');

firebase.initializeApp({ databaseURL: process.env.FIREBASE_DB_URL });
const firedb = firebase.database();

module.exports = { firedb };