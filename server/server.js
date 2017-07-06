require('./config/config');

const express = require('express');
var app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


app.use(bodyParser.json());

//ADD A TODO
app.post('/todos',(req,res)=>{
  Todo.create(req.body).then((todo)=>{
    res.send(todo);
  },(err)=>{
    res.sendStatus(400);
  }).catch((err)=>{
    res.sendStatus(400);
  })
});

//GET ALL TODOS
app.get('/todos',(req,res)=>{

  Todo.find({}).then((todos)=>{
    res.send({todos})
  },(err)=>{
    res.sendStatus(400);
  }).catch((err)=>{
    res.sendStatus(400);
  })
});

//GET TODO BY ID
app.get('/todos/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.sendStatus(404);
  }

  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.sendStatus(404);
    }
    res.send({todo});

  }).catch((err)=>{
    res.sendStatus(400);
  });
});

//DELETE TODO BY ID
app.delete('/todos/:id',(req,res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.sendStatus(404);
  }

  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      return res.sendStatus(404);
    }
    res.send({todo});

  }).catch((err)=>{
    res.sendStatus(400);
  });
});

//UPDATE TODO
app.patch('/todos/:id',(req,res)=>{
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(id)){
    return res.sendStatus(404);
  }

  if(_.isBoolean(body.completed)&& body.completed){
     body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
    if(!todo)
      return res.sendStatus(404);

    res.send({todo});
  }).catch((err)=>{
    res.sendStatus(400);
  });

});



//SETING THE SERVER
app.listen(process.env.PORT || 3000,()=>{
  console.log('listening on port 3000');
});

module.exports = {app}
