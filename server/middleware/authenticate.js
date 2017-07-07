const {User} = require('./../models/user');

var authenticate = (req,res,next)=>{
  var token = req.header('x-auth');
  User.findByToken(token).then((user)=>{
    if(!user)
      res.sendStatus(404);

    req.user = user;
    req.token = token;
    next();
  },(err)=>{
    res.sendStatus(401)
  }).catch((err)=>{
    res.sendStatus(400);
  })
}

module.exports = {authenticate};
