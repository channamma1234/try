let mongoose=require('mongoose');
let artschema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
});
let Article=module.exports=mongoose.model('article',artschema);