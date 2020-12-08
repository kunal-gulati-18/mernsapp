const express=require('express');
var router=express.Router()
const mongoose=require('mongoose');
const requireLogin = require('../middleware/requireLogin');
var loginmiddleware=require('../middleware/requireLogin')
var postmodel=require('../modules/post')
var usermodel=require('../modules/userData')

router.post('/createpost',loginmiddleware,(req,res,next)=>{

    console.log(req.body);
    var title=req.body.title;
    var body=req.body.body;
    var url=req.body.url;
    console.log(title,body,url);
    if(!title || !body || !url)
    {
        return res.status(422).json({
            error:"Please add all the fields"
        })
    }

    console.log(req.user);
    req.user.password=undefined;
    const post=new postmodel({
        title:title,
        body:body,
        photo:url,
        postedby:req.user
    })

    post.save()
    .then(data=>{
        res.status(200).json({
            message:"Post Created Successfully!!",
            postdetails:data
        })
    })
    .catch(err=>{
        console.log(err);
    })
})

{/*sort('-createdAt') here - means descending order*/}
router.get('/viewallpost',loginmiddleware,(req,res)=>{

    postmodel.find({})
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .sort('-createdAt')
    .then(data=>{
        if(data)
        {
            res.status(201).json({
                results:data
            })
        }

        else{
            return res.status(201).json({
                results:"No post found!!"
            })
        }
    })

    .catch(err=>{
        console.log(err);
    })

})

router.get('/getsubpost',loginmiddleware,(req,res)=>{

    //if postedby in req.user.following
    postmodel.find({postedby:{$in:req.user.following}})
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .sort('-createdAt')
    .then(data=>{
        if(data)
        {
            res.status(201).json({
                results:data
            })
        }

        else{
            return res.status(201).json({
                results:"No post found!!"
            })
        }
    })

    .catch(err=>{
        console.log(err);
    })

})


router.get('/viewmypost',loginmiddleware,(req,res)=>{

    // console.log
    postmodel.find({postedby:req.user._id})
    .populate("postedby","_id name")
    .then(data=>{
        
        if(data.length>0)
        {
            res.status(201).json({
                results:data
            })
        }

        else{
            return res.status(201).json({
                results:"No post found!!"
            })
        }
    })
    .catch(err=>{
        console.log(err)
    })
})

{/*using new:true mongodb will return new updated records*/ }
router.put('/like',requireLogin,(req,res)=>{
    
    postmodel.findByIdAndUpdate(req.body.postID,{
        $push:{likes:req.user._id}
    },{
        new:true  
       
    }).exec((err,results)=>{
        if(err) 
        {
            return res.status(422).json({error:err})
        }
        
        else
        {
            res.json(results)
        }


    }) 
    
})

router.put('/unlike',requireLogin,(req,res)=>{
    
    postmodel.findByIdAndUpdate(req.body.postID,{
        $pull:{likes:req.user._id}
    },{
        new:true  
       
    }).exec((err,results)=>{
        if(err) 
        {
            return res.status(422).json({error:err})
        }
        
        else
        {
            res.json(results)
        }


    }) 
    
})


router.put('/comments',requireLogin,(req,res)=>{

    var comments={
        text:req.body.comment,
        postedby:req.user._id

    }

    postmodel.findByIdAndUpdate(req.body.postID,{
        $push:{comments:comments}
    },{
        new:true
    })
    .populate("comments.postedby","_id name")
    .populate("postedby","_id name")
    .exec((err,results)=>{

        if(err) 
        {
            return res.status(422).json({error:err})
        }
        
        else
        {
            res.json(results)
        }
    })


   
})


router.delete('/deletepost/:postid',requireLogin,(req,res)=>{

    var postid=req.params.postid;
    postmodel.findOne({_id:postid})
    .populate("postedby","_id name")
    .exec((err,postData)=>{
        
        if(err || !postData)
        {
            return res.status(422).json({
                error:err
            })
        }

        if(postData.postedby._id.toString() === req.user._id.toString())
        {
            postData.remove()
            .then(data=>{
                
                res.status(201).json({
                    message:'Post deleted successfully!!',
                    result:data
                })
            })
            .catch(err=>{
                console.log(err);
            })
        }

        else{
            res.json({
                message:'You cannot delete the post!!'
            })
        }
    })


})

 router.delete('/deletecomments/:itemid/:commentid',requireLogin,(req,res)=>{
    var itemid=req.params.itemid; 
    var commentid=req.params.commentid;
    console.log(itemid,commentid);
    const comment={_id:commentid}
    postmodel.findByIdAndUpdate(itemid,{
        $pull:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedby", "_id name")
    .populate("postedby", "_id name ")
    .exec((err,postComment)=>{
        if (err || !postComment) {
            return res.status(422).json({ error: err });
          } else {
           
            const result = postComment;
            res.json(result);
          }
    })
    

 })


 
module.exports=router;