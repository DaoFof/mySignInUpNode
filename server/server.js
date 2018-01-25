const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const port = process.env.PORT || 3000;
const partialsPath = path.join(__dirname,'../views/partials');
const publicPath = path.join(__dirname, '../public');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

var mongoose = require('./db/mongoose.js')
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate');

var app = express();

hbs.registerPartials(partialsPath);

hbs.registerHelper('getCurrentYear',()=>{
  return new Date().getFullYear();
});

app.set('view engine', 'hbs');

//app.engine('html', hbs.__express);

app.use(express.static(publicPath));
// app.use(session({
//   secret: 'mysecret',
//   cookie:{
//     maxAge:60000
//   },
//   resave: false,
//   saveUninitialized: true
//   })
// );
//
// var sess;

app.get('/login',(req, res)=>{
  res.redirect("/home.html");
})

app.get('/',(req, res)=>{
  res.render('help.hbs');
});
app.get('/home',authenticate,(req, res)=>{
  //res.render('home.hbs');
  // if(!req.user){
  //   console.log('executed');
  //   res.status(401).render('help.hbs');
  // }else{
    var token = req.token;
    res.render('home.hbs',{
      user: req.user
    });
  //}

});

app.post('/', urlencodedParser, (req, res)=>{
  //console.log('Req.body: ', req.body);
  //sess = req.session;
  var type = req.body.post;
  if(type==='signup'){
    var objUser = {
      email: req.body.email,
      password: req.body.password,
      username : req.body.username,
    };
    var user =  new User(objUser);

    user.save().then(()=>{
      //console.log('Success');
      return user.generateAuthToken();
    }).then((token)=>{
      // req.session.token = token;
      // res.header('x-auth', token).send({token});
      res.send({token});
    }).catch((e)=>{
      //console.log(JSON.stringify(e, undefined, 2));
      res.status(400).send(JSON.stringify(e, undefined, 2));
    });
  }else if(type==='signin'){
    var objUser={
      username: req.body.username,
      password: req.body.password
    };
    User.findByCredentials(req.body.username, req.body.password).then((user)=>{
      return user.generateAuthToken().then((token)=>{
        //req.session.token = token;
        //res.header('x-auth', token).send({token});
        res.send({token});
      });
    }).catch((e)=>{
      //console.log(JSON.stringify(e, undefined, 2));
      res.status(400).send(JSON.stringify(e, undefined, 2));
    });

  }
  //res.status(200).send(JSON.stringify(objUser));
});

app.get('/logout',authenticate, (req,res)=>{
  // console.log(req.token);
  req.user.removeToken(req.token).then(()=>{
    //console.log('token remove');
    res.redirect('/');
  }).catch((e)=>{
    console.log(e);
  });
  // req.session.destroy(function(err) {
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     res.redirect('/');
  //   }
  //});
});

app.listen(port,()=>{
  console.log(`Server is up on ${port}`);
});
