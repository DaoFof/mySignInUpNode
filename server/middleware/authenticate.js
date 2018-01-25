var {User} = require('./../models/user');
const Cookies = require('cookies');


var authenticate = (req, res, next) =>{
  //var token = req.header('x-auth');
  /*
  req.header() is getting the value so we only pass the key
  */
  var cookies = new Cookies(req, res);
  var token = cookies.get('token');
  //console.log('x-auth: ', token);
  //var token = req.session.token;
  //console.log('token',token);
  User.findByToken(token).then((user)=>{
    if(!user){
      return Promise.reject();// if executed it will go right to the catch block
    }

    req.user = user;
    req.token = token;
    console.log('token: ', token);
    res.clearCookie('token');
    next();//to be able to continue program execution where the function authenticate() is call
  }).catch((e)=>{
    console.log(e);
    //res.status(401).send(e);
    res.redirect('/home.html');
    //status(401) means authentication require
  });
};
/*
authenticate() is a middleware which will be doing authentication
*/

module.exports = {authenticate};
