const request = require('supertest');
const expect = require('expect');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
  {
    text:'testing todos 1'
  },
  {
    text:'testing todos 2'
  }
];

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=>done());

});

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
