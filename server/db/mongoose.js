const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_HEROKU||process.env.MONGODB,{useMongoClient:true});

module.exports = {mongoose};
