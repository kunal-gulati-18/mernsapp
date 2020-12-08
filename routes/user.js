const express=require('express');
var router=express.Router()
const mongoose=require('mongoose');
const requireLogin = require('../middleware/requireLogin');
var loginmiddleware=require('../middleware/requireLogin')
var postmodel=require('../modules/post')
var usermodel=require('../modules/userData')


router.get('/users/:id',requireLogin,(req,res)=>{
    usermodel.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{

        postmodel.find({postedby:req.params.id})
        .populate("postedby","_id name")
        .exec((err,posts)=>{

            if(err || !posts)
            {
                return res.status(404).json({
                    error:err
                })
            }

            res.json({user,posts})
        })
        
    })
    .catch(err=>{
        return res.status(404).json({
            errro:"User not found!!"
        })
    })
})

router.put('/follow/:id',requireLogin,(req,res)=>{

    var userid=req.params.id;

    usermodel.findByIdAndUpdate(userid,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err)
        {
            return res.status(401).json({
                error:err
            })
        }

        usermodel.findByIdAndUpdate(req.user._id,{
            $push:{following:userid}
        },
        {
            new:true
        }).select("-password").then(results=>{
            res.json(results)
        }).catch(err=>{
            console.log(err)
        })
    })
    // }).exec((err,results)=>{
    //     if(err || !results)
    //     {
    //         return res.status(401).json({
    //             error:data.err
    //         })
    //     }

    //     else{
    //              res.json(results);
    //     }

    // })

})

router.put('/unfollow/:id',requireLogin,(req,res)=>{

    var userid=req.params.id;
    console.log('user id',userid)
    usermodel.findByIdAndUpdate(userid,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err)
        {
            return res.status(401).json({
                error:err
            })
        }

        usermodel.findByIdAndUpdate(req.user._id,{
            $pull:{following:userid}
        },
        {
            new:true
        }).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            console.log(err)
        })
    })
    // }).exec((err,results)=>{
    //     if(err || !results)
    //     {
    //         return res.status(401).json({
    //             error:data.err
    //         })
    //     }

    //     else{
    //              res.json(results);
    //     }

    // })

})

{/*for profile */}
router.get('/userdata',requireLogin,(req,res)=>{
    usermodel.findOne({_id:req.user._id})
    .select("-password")
    .then(user=>{

        res.json(user);
        
    })
    .catch(err=>{
        return res.status(404).json({
            error:"User not found!!"
        })
    })
})


router.post('/updatepicture',requireLogin,(req,res)=>{

    var imageurl=req.body.image;
    usermodel.findByIdAndUpdate(req.user._id,{
        "image":imageurl
    },{
        new:true
    })
    .select('-password')
    .then(user=>{
        
        res.json(user);
    })


})

router.post('/getsearcheduser',requireLogin,(req,res)=>{
    var searchname=req.body.name;

    usermodel.find({"name":searchname})
    .select("-password")
    .then(results=>{
        console.log(results.length)
        if(results.length==0)
        {
            console.log("no user!!")
            res.json({
                error:"No such user exists!!"
            })
        }
        else
        {
            
            res.json({
                message:results
            })
        }
    })
    .catch(err=>{
        console.log(err)
    })
})




module.exports=router;