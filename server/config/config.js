var env = process.env.NODE_ENV || 'development';
if(env==='development'){
  process.env.MONGODB = 'mongodb://localhost/todoApp'
}else if(env === 'test'){
  process.env.MONGODB = 'mongodb://localhost/todoAppTest'
}
