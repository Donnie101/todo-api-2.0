const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/todoApp',{useMongoClient:true});

module.exports = {mongoose};