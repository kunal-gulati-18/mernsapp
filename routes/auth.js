const express=require('express')
const app=express();
const router=express.Router();
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const crypto=require('crypto')
const nodemailer = require("nodemailer");
const {MONGOURI,SECRET}= require('../keys')
const requireLogin=require('../middleware/requireLogin')
var usermodel=require('../modules/userData');
var logindatamodel=require('../modules/logindata')
const { Buffer } = require('buffer');


      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user:"gulatikunal01@gmail.com", // generated ethereal user
          pass: "12moore12", // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
      });



router.get('/protected',requireLogin,(req,res)=>{

    res.send("Hello");
})


router.post('/signup',(req,res)=>{

    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    var image=req.body.image;
    if(!email || !name || !password )
    {
        res.status(422).json({ error:"Please Fill all the Details!!"}) 
    }
    else
 
    {
        usermodel.findOne({email:email})
                .then((savedUser)=>{
                    if(savedUser)
                    {
                        return res.status(401).json({
                            error:"User with same email already exists!!"
                        }) 
                    }

                    else{
                        
                            bcrypt.hash(password, 10, function(err, hash) {
                                // Store hash in your password DB.
                                var storeUser=new usermodel({
                
                                    name,
                                    email,
                                    password:hash,
                                    image
                                })
                            
                            
                                
                                storeUser.save()
                                .then(user=>{
                                    console.log(user);
                                    transporter.sendMail({
                                        from: '"Kunal Gulati" <gulatikunal01@gmail.com>', // sender address
                                        to: user.email, // list of receivers
                                        subject: "no-reply", // Subject line
                                        text: "Welcome to Mernsapp!!", // plain text body
                                        html: "<h1>Welcome to Mernsapp!!</h1>", // html body
                                      });
                                    res.status(201).json({
                                        message:"Data Saved Successfully"
                                    })
                                })
                                .catch(err=>{
                                    console.log(err);
                                })
                            });
                        
                    }
                })

                .catch(err=>{
                    console.log(err);
                })

        


}


})


router.post("/signin",(req,res)=>{

    var email=req.body.email;
    var password=req.body.password;
    if(!email || !password )
    {
       return res.status(422).json({
            error:"Please Fill all the Details!!"
        }) 
    }

    usermodel.findOne({email:email})
    .then((user)=>{

        if(user)
        {
            // console.log(user.password);
            bcrypt.compare(password,user.password)
            .then(domatch=>{  //domatch gets a boolean value

                if(domatch)
                {
                    const token= jwt.sign({
                        _id:user._id
                      }, SECRET, { expiresIn: '1h' });  //generating token on the basis of user id
                    
                      const {_id,name,email,followers,following,image}=user;
                    res.json({
                        message:"Logged in Successfully!!",
                        token,
                        user:{_id,name,email,followers,following,image}
                    }) 
                    
                    var loginuserdata=new logindatamodel({
                        name,
                        email
                    })

                    loginuserdata.save()
                    .then(data=>{
                        console.log('login details of user',data)
                    })

                }

                else
                {
                    return res.status(401).json({
                        error:"Invalid email/password!!"
                    }) 
                }
            })
            .catch(err=>{
                console.log(err);
            })
        }

        else{
            //if no such user exists 

            return res.status(422).json({
                message:"Invalid email/password!!"
            }) 
        }
    })
    .catch(err=>{
        console.log(err);
    })




    
})


router.post('/forgotpassword',function(req,res,next){
    
    crypto.randomBytes(32,(err,buffer)=>{
        if(err)
        {
            console.log(err)
        }
        const token=buffer.toString("hex");
        usermodel.findOne({email:req.body.email})
    .then(user=>{
        if(!user)
        {
            return res.status(401).json({
                error:"No such User exists!!"
            })
        }

        user.resetToken=token;
        user.expireToken=Date.now()+3600000    //user will be able to reset pass for only one hour using this link
        user.save().then(results=>{

            transporter.sendMail({
                from: '"Kunal Gulati" <gulatikunal01@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: "password reset", // Subject line
                html: `<p>You requested for a password change!!</p>
                        <h5>You can click on this <a href="http://localhost:3000/forgotpassword/${token}">link to reset password</a></h5>` // html body
              });

              res.status(201).json({
                message:"Check your email!!"
            })
        })
        
        


    })
    .catch(err=>{
        console.log(err)
    })
    })
    
   
})


router.post('/resetpassword',(req,res)=>{

    var passval=req.body.password;
    var tokenval=req.body.token;

    console.log(passval,tokenval);
    usermodel.findOne({"resetToken":tokenval})
    .then(user=>{
        if(user)
        {   
            console.log('oksirrr');
            bcrypt.hash(passval, 10, function(err, hash){

        
                usermodel.findOneAndUpdate({"resetToken":tokenval},{
                    "password":hash
                },{
                    new:true
                })
                .then(results=>{
                    
                    res.status(201).json({
                        message:"Your password has been successfully changed!!"
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
            })
        }

        else
        {
            res.status(402).json({
                error:"Your time has been expired!!"
            })
        }
    })
    .catch(err=>{
        console.log(err)
    })
   

    

})

router.post('/logindetails',(req,res)=>{
    var {email}=req.body;

    logindatamodel.find({"email":email})
    .then(data=>{
        console.log(data.length)
        if(data.length==0)
        {
           
            res.json({
                success:"You can login!!"
            })
        }

        else
        {
            res.json({
                message:"User is already logged in!!"
            })
        }
    })
    .catch(err=>{
        console.log(err);
    })


})

router.post('/deletelogindetails',(req,res)=>{
    var {email}=req.body;

    logindatamodel.findOneAndDelete({"email":email})
    .then(data=>{
        console.log('deleted record is',data)
    })
    .catch(err=>{
        console.log(err);
    })


})

module.exports=router;