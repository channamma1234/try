const express = require('express');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const expressValidator=require('express-validator');
const flash = require('connect-flash');
const passport=require('passport')
const session =require('express-session');
const config=require('./config/database')

mongoose.connect(config.database);
let db=mongoose.connection;
mongoose.set('debug', true);

//check connection
db.once('open',function(){
    console.log('connected to mongodb');
});
//check for error
db.on('error',function(err){
    console.log(err);
});
const app =express();
// set pubic as static
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }));

  app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
// express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace=param.split('.')
        , root  =namespace.shift()
        , formParam = root;
    while(namespace.length){
        formParam +='[' +namespace.shift() + ']';
    }
    return{
        param:formParam,
        msg:msg,
        value:value
    };
    }
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*',function(req, res, next){
    res.locals.user=req.user||null;
    next();
})  

//bring in models
let Article=require('./models/article');

//load view engines
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');

// bodyparser middle ware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//home route
app.get('/',function(req,res){
 Article.find({},function(err,arti){
        if(err){
            console.log(err);
        }else{
            res.render('index',{
                title:'ART',
                arti:arti
            });
        }
    });
    
});

let articles=require('./routes/articles');
let users=require('./routes/users');
app.use('/articles', articles);
app.use('/users',users );


app.listen(3000,function(){
    console.log("server started at 3000");
});