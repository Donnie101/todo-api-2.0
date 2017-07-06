const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  }
});

var User = mongoose.model('User',UserSchema);

module.exports = {User};
