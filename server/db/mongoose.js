const mongoose = require('mongoose');
var dbLink = process.env.MONGODB || 'mongodb://localhost/todoApp';
mongoose.Promise = global.Promise;
mongoose.connect(dbLink,{useMongoClient:true});

module.exports = {mongoose};
