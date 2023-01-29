const express=require('express');
const mongoose=require('mongoose');
const {MONGOURI}=require('../keys')
const {ObjectId}=mongoose.Schema.Types
mongoose.connect("mongodb+srv://Kunal_Gulati:4P1t88DQPZuFYQLg@cluster0.ale9a.mongodb.net/InstaUserData?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:true});

const UserSchema= new mongoose.Schema({

    name:{
        type:String,
        required:true,

    },

    email:{

        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    
    followers:[{
        type:ObjectId,
        ref:"UserSchema"
    }],
    following:[{
        type:ObjectId,
        ref:"UserSchema"
    }],

    resetToken:String,
    expireToken:Date,

    image:{
        type:String,
        default:'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
    }
})


var UserModel=mongoose.model('UserSchema',UserSchema);
module.exports=UserModel;