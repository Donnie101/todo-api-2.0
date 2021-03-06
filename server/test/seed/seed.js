const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

const users = [
  {
    _id:userOneId,
    email:'userOne@gmail.com',
    password:'userOnepass',
    tokens:[{
      access:'auth',
      token:jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id:userTwoId,
    email:'userTwo@gmail.com',
    password:'userTowPassword',
    tokens:[{
      access:'auth',
      token:jwt.sign({_id:userTwoId,access:'auth'},process.env.JWT_SECRET).toString()
    }]
  }
];

const todos = [
  {
    _id: new ObjectID(),
    text:'testing todos 1',
    _creator:userOneId

  },
  {
    _id: new ObjectID(),
    text:'testing todos 2',
    _creator:userTwoId,
    completed:true,
    completedAt:666
  }
];

const populateTodos = (done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());

};

const populateUsers = (done)=>{
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne,userTwo]);
  }).then(()=>{
    done();
  })
}



module.exports = {todos,users,populateUsers,populateTodos};
