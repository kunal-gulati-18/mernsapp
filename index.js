const express=require('express')
const app=express();
const mongoose=require('mongoose');
const nodemailer = require("nodemailer");
const cors=require('cors');
const Port=process.env.PORT || 5000;
var usermodel=require('./modules/userData');
var postModel=require('./modules/post');


app.use(express.json())  //jitni bhi json aayein yh parse karega
app.use(require('./routes/auth'));

app.use(require('./routes/post'));
app.use(require('./routes/user'))

var loginMiddleware=(req,res,next)=>{
    
    console.log("YOu need to login to continue!!");
    next();
}

// app.use(loginMiddleware);  //used on all of the routes
// app.get('/',loginMiddleware,(req,res)=>{

//     console.log("Inside login!!")
// res.send("Hello")
// })

if(process.env.NODE_ENV=="production")
{
    app.use(express.static('client/build'))
    const path=require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(Port,()=>console.log("Server Up and running on port "+ Port+"!!"));



