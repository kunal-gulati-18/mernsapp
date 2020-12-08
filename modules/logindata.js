const express=require('express');
const mongoose=require('mongoose');
const {MONGOURI}=require('../keys')
const {ObjectId}=mongoose.Schema.Types
mongoose.connect("mongodb+srv://Kunal:BzuElQVKbS3CNbKR@cluster0.ale9a.mongodb.net/InstaUserData?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:true});

const LoginDetailsSchema= new mongoose.Schema({

    name:{
        type:String,
        required:true,

    },

    email:{

        type:String,
        required:true
    }
},{timestamps:true})


var LoginDataModel=mongoose.model('LoginData',LoginDetailsSchema);
module.exports=LoginDataModel;