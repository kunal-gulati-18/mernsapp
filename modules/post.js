var mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
var {MONGOURI,SECRET}=require('../keys')
mongoose.connect("mongodb+srv://Kunal:BzuElQVKbS3CNbKR@cluster0.ale9a.mongodb.net/InstaUserData?retryWrites=true&w=majority",{useNewUrlParser:true, useUnifiedTopology:true})

var postSchema=new mongoose.Schema({

    title:{
        type:String,
        required:true
    }

    ,
    body:{
        type:String,
        required:true
    },

    photo:{
        type:String,
        required:true
    },

    likes:[{
        type:ObjectId,
        ref:"UserSchema"
    }],
    comments:[{
        text:String,
        postedby:{
            type:ObjectId,
            ref:"UserSchema"
        }
    }],
    
    postedby:{
        //creating relationship between userData and post
        type:ObjectId,
        ref:"UserSchema"
        
    }

},{timestamps:true})//these timestamps will arrange all the records in descending order with latest one on top and it automatically adds createdAt in the db


var postModel=mongoose.model('postSchema',postSchema);
module.exports=postModel;

