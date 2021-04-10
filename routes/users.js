const express =require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');

//bring in  usermodels
let User=require('../models/user');

router.get('/register',function(req, res){
    res.render('register');
});

//register process
router.post('/register',function(req,res){
    const name=req.body.name;
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    const password2=req.body.password2;

    req.checkBody('name','name is required').notEmpty();
    req.checkBody('email','email is required').notEmpty();
    req.checkBody('email','email is not valid').isEmail();
    req.checkBody('username','username is required').notEmpty();
    req.checkBody('password','password is required').notEmpty();
    req.checkBody('password2','passwords do not match').equals(req.body.password);

    let errors=req.validationErrors();
    if(errors){
    res.render('register',{
        errors:errors
    });
} else {
const newUser= new User({
    name:name,
    email:email,
    username:username,
    password:password
});
bcrypt.genSalt(10,function(err,salt){
    bcrypt.hash(newUser.password,salt,function(err,hash){
        if(err){
            Console.log(err);
        }
        newUser.password=hash;
        newUser.save(function(err){
            if(err){
                Console.log(err);
                return;
            }else{
                req.flash('success','registred and can login now');
                res.redirect('/users/login');
            }
        });
        
    });
});

}
});

//login route
router.get('/login',function(req, res){
    res.render('login');
});
//login post
router.post('/login',function(req,res, next){
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req, res, next)
    });

    router.get('/logout',function(req, res){
        req.logout();
        req.flash('success','you are logged out');
        res.redirect('/users/login');
    });

module.exports=router;










