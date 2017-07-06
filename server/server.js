const express = require('express');
var app = express();
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/User');


app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  Todo.create(req.body).then((todo)=>{
    res.send(todo);
  },(err)=>{
    res.sendStatus(400);
  }).catch((err)=>{
    res.sendStatus(400);
  })
});

app.get('/todos',(req,res)=>{
  
  Todo.find({}).then((todos)=>{
    res.send(todos)
  },(err)=>{
    res.sendStatus(400);
  }).catch((err)=>{
    res.sendStatus(400);
  })
});

app.get('/todos/:id',(req,res)=>{
  var id = req.body.id;
  Todo.findOne(id).then((todo)=>{
    res.send(todo);
  },(err)=>{
    res.sendStatus(400);
  }).catch((err)=>{
    res.sendStatus(400);
  })
});


app.listen(process.env.PORT || 3000,()=>{
  console.log('listening on port 3000');
});

module.exports = {app}