const mongoose = require('mongoose');

var TodoSchema = new mongoose.Schema({
  text:{
    type:String
  },
  completed:{
    type:Boolean
  },
  completedAt:{
    type:Number
  }
});

var Todo = mongoose.model('Todo',TodoSchema);

module.exports = {Todo};
