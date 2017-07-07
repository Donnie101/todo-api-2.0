const request = require('supertest');
const expect = require('expect');

const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {populateTodos,todos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST/ todo',()=>{
  it('should create a new todo',(done)=>{
    var text = todos[0].text;
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text)
      }).end((err,res)=>{
        if(err){
          return done(err);
        }

        Todo.find({}).then((todos)=>{
          expect(todos.length).toBe(3);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err)=>{
          done(err);
        })

      });
  });

  it('should not create a todo with invalid data',(done)=>{
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        Todo.find({}).then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((err)=>{
          done(err);
        });
      });
  });
});

describe('GET/ todos ',()=>{
  it('should get all todos',(done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      }).end(done);
  });
});

describe('GET/ todos/:id ',()=>{
  it('should get todo by id',(done)=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}` )
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      }).end(done);
  });

  it('should return 404 if todo not found',(done)=>{
    var hexId = new ObjectID().toHexString();
    request(app)
    .get('/todos/'+hexId)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids',(done)=>{

    request(app)
    .get('/todos/555')
    .expect(404)
    .end(done);
  });

});

describe('DELETE/ todos/:id',()=>{
  it('should delete todo by id',(done)=>{
    var hexId = todos[1]._id.toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(hexId);
      }).end((err,res)=>{
        if(err){
          return done(err);
        }

        Todo.findById(hexId).then((todo)=>{
          expect(todo).toNotExist();
          done();
        }).catch((err)=>{
          done(err);
        });

      });
  });

  it('should return 404 if todo not found',(done)=>{
    var hexId = new ObjectID().toHexString();
    request(app)
    .delete('/todos/'+hexId)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids',(done)=>{

    request(app)
    .delete('/todos/555')
    .expect(404)
    .end(done);
  });
});


describe('PATCH /todos/:id',()=>{
  it('should update the todo',(done)=>{
    var hexId = todos[0]._id.toHexString();
    var text = 'I AM YOUR FATHER';
    var completed = true;

    request(app)
      .patch(`/todos/${hexId}`)
      .send({text,completed})
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(completed);
        expect(res.body.todo.completedAt).toBeA('number');
        done();
      }).catch((err)=>{
        done(err);
      });

  });

  it('should clear completedAt when todo is not completed',(done)=>{
    var hexId = todos[1]._id.toHexString();
    var text = 'I AM YOUR FATHER';
    var completed = false;
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text,completed})
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(completed);
        expect(res.body.todo.completedAt).toNotExist();
        done();
      }).catch((err)=>{
        done(err);
      });
  });

});

describe('GET/ users/me',()=>{
  it('should return user if authenticated',(done)=>{
    var user = users[0];
    request(app)
      .get('/users/me')
      .set('x-auth',user.tokens[0].token)
      .send(user)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(user._id.toHexString());
        expect(res.body.email).toBe(user.email);

      }).end(done);
  });

  it('should return a 401 if not authenticated',(done)=>{
    var user = users[1];
    request(app)
      .get('/users/me')
      .send(user)
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({});
      }).end(done);
  })

});

describe('POST/ users',()=>{
  it('sould create a user',(done)=>{
    var email = 'theHacker@gmail.com';
    var password = 'password';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body.email).toBe(email);
        expect(res.body._id).toExist();
      }).end((err)=>{
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        })

      });
  });

  it('should return validation errors if req invalid',(done)=>{
    var email = '';
    var password='';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);
  });

  it('sould not create a user if email in use',(done)=>{
    var email = users[0].email;
    var password='password';
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);
  });

});
