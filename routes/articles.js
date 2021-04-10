const express =require('express');
const router=express.Router();

//bring in models
let Article=require('../models/article');
let User=require('../models/user');


// add article
router.get('/add',ensureAuthenticated, function(req,res){
    res.render('add_article',{
        title:'ADD ARTICLE'
    });
});

//post artcle
router.post('/add',function(req,res){
    let article=new Article();
    article.title=req.body.title;
    article.author=req.user._id;
    article.body=req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }else{
req.flash('success', 'article added');
res.redirect('/')
        }
    });
            
});
//edit article
router.get('/edit/:id', ensureAuthenticated, function(req,res){
    Article.findById(req.params.id, function(err,artic){
        console.log('here hrere ');
        if(artic.author!=req.user._id){
            req.flash('danger', 'not authorized');
            res.redirect('/');
            return ;
        }
        res.render('edit_article',{
            title:'EDIT ARTICLE',
            artic:artic
        
        });   
    });
});
//update artcle
router.post('/edit/:id',function(req,res){
    let article={};
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;

    let query={_id:req.params.id}

    Article.update(query,article,function(err){
        if(err){
            console.log(err);
            return;
        }else{
req.flash('success', 'article updated');
res.redirect('/')
        }
    });
            
});

//delete article
router.delete('/:id',function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }
    let query={_id:req.params.id}
    Article.findById(req.params.id,function(err,articl){
    if(articl.author!=req.user._id){
res.status(500).send();
    }else{
        Article.remove(query, function(err){
            if(err){
                console.log(err);
            }
            req.flash('success', 'article deleted');
            res.send('success');
        });    
    }
    });
});
//get sngle article
router.get('/:id',function(req,res){
    Article.findById(req.params.id, function(err,artic){
        User.findById(artic.author,function(err, user){
            res.render('article',{
                artic:artic,
                author:user.name
            
        });
        });   
    });
});

//access controls
function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()){
     return next();   
    }else{
        req.flash('danger','please login');
        res.redirect('/users/login');
    }
}
 
module.exports=router;