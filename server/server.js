const mongoose = require('mongoose');
const express = require('express');
var app = express();
const {Todo} = require('./models/todo');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/todoApp',{useMongoClient:true});

Todo.create({
  text:'Hey now you are an all star',
  completed:false
})
