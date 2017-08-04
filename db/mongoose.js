const mongoose = require('mongoose');

console.log(`Initializing Mongoose on ${process.env.MONGODB_URI}`);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

module.exports = { mongoose };
