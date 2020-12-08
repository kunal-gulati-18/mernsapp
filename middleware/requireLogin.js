const jwt=require('jsonwebtoken');
const {MONGOURI,SECRET}= require('../keys');
const mongoose=require('mongoose');
var usermodel=require('../modules/userData')
module.exports=(req,res,next)=>{

    const {authorization}= req.headers;
    if(!authorization)
    {
         return res.status(401).send({
            error:"You must be logged in!!"
        })
    }

    else{
        const token=authorization.replace("Bearer ","");
        jwt.verify(token,SECRET,(err,payload)=>{

            if(err)
            {
                return res.status(401).send({
                    error:"You must be logged in!!"
                })
            }

            const {_id}=payload;

            usermodel.findById(_id)
            .then(userdata=>{
                req.user=userdata;
                next();
            })
            .catch(err=>{
                console.log(err);
            })

            

        })

    }
}