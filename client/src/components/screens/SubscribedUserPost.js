import React,{useState,useContext,useEffect} from 'react';
import {Link} from 'react-router-dom';
import { UserContext } from '../../App';


const SubscribedUserPost=()=>{

    const {state,dispatch}=useContext(UserContext);
    const [comment,setComment]=useState('');
    const [data,setData]=useState([]);
    var tokenval=localStorage.getItem('jwt');
    useEffect(()=>{

        fetch('/getsubpost',{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+tokenval
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log('subscribed post',result);
            setData(result.results);
        })
    },[])



    const likepost=(id)=>{

        fetch('/like',{
            method:"PUT",
            headers:{

                "Content-Type":"application/json",
                "Authorization":"Bearer "+tokenval
            },
            body:JSON.stringify({
                postID:id
            })

        })
        .then(res=>res.json())
        .then(results=>{
            

            const newdata=data.map(item=>{
                if(item._id==results._id)
                {
                    console.log('ok',results)
                    return results
                }
                else{
                    console.log('items',item)
                    return item
                }
            })

            setData(newdata);
            
        })
        .catch(err=>{
            console.log(err);
        })

    }

    const unlikepost=(id)=>{

        fetch('/unlike',{
            method:"PUT",
            headers:{

                "Content-Type":"application/json",
                "Authorization":"Bearer "+tokenval
            },
            body:JSON.stringify({
                postID:id
            })

        })
        .then(res=>res.json())
        .then(results=>{
            const newdata=data.map(item=>{
                if(item._id==results._id)
                {
                   
                    return results
                }
                else{
                    
                    return item
                }
            })

            setData(newdata);
        })
        .catch(err=>{
            console.log(err);
        })

    }

    const addComment=(text,id)=>{

        fetch('/comments',{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+tokenval

            },
            body:JSON.stringify({

                comment:text,
                postID:id

            })
            
        })
        .then(res=>res.json())
        .then(results=>{
            console.log('comments',results);
            const newdata=data.map(item=>{
                if(item._id==results._id)
                {
                   
                    return results
                }
                else{
                    
                    return item
                }
            })

            setData(newdata)
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const deletepost=(id)=>{
        fetch(`/deletepost/${id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+tokenval
            }
        })
        .then(res=>res.json())
        .then(results=>{
            console.log('delete',results);
            const newdata=data.filter(item=>{
                return item._id!=results.result._id
            })

            setData(newdata);

        })
        .catch(err=>{
            console.log(err)
        })
    }

    {/* item hai purana results mein hai naya, to naya vaala jsime comment deleted hoga vo newdata mein jaayega*/}

    const deleteComment=(itemid,commentid)=>{
            fetch(`/deletecomments/${itemid}/${commentid}`,{

                method:"DELETE",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+tokenval
                }
            })
            .then(res=>res.json())
            .then(results=>{

                const newdata=data.map(item=>{
                    if(item._id==results._id)
                    {
                        return results;
                    }
                    else{
                            return item;
                    }
                })

                setData(newdata);
            })
            .catch(err=>{
                console.log(err)
            })
    }

    if(data)
    {
    return(
        <>
        <div className="home">
            {
                
                data.map(item=>{

                    return(
                        <div className="card home-card" key={item._id}>
                        <h5><Link to={item.postedby._id!=state._id?'/profile/'+item.postedby._id:'/profile'}>{item.postedby.name}</Link> {item.postedby._id==state._id 
                        &&<i className="material-icons" style={{color:"red", float:"right"}}
                        onClick={()=>{deletepost(item._id)}}
                        >delete</i>
                        } </h5>
                        <div className="card-image">
                        <img src={item.photo}/>
                        </div>
                        <div className="card-content">
                        <i className="material-icons" style={{color:"red"}}>favorite</i>
                        
                        {
                        item.likes.includes(state._id)?
                        <i className="material-icons" style={{color:"black",cursor:"pointer"}} onClick={()=>{unlikepost(item._id)}}>thumb_down</i>
                        :<i className="material-icons" style={{color:"black",cursor:"pointer"}} onClick={()=>{likepost(item._id)}}>thumb_up</i>

                        
                        }
                        
                        <h6>{item.likes.length} likes</h6>
                        <h6>{item.title}</h6>
                        <p>{item.body}</p>
                        {
                            item.comments.map(records=>{
                                return(
                                    <>
                                    <h6 key={records._id}><span style={{fontWeight:"500"}}>{records.postedby.name}</span> {records.text}  {records.postedby._id==state._id 
                                    &&<i className="material-icons" style={{color:"red", float:"right"}} onClick={()=>{deleteComment(item._id,records._id)}}>delete</i>
                                    }</h6>
                                    </>
                                )
                            })
                        }
                        <form onSubmit={(e)=>{
                            e.preventDefault();
                            addComment(e.target[0].value,item._id);
                            e.target[0].value='';
                        }}>
                        <input type="text" id="comments" placeholder="Add Comment"/>
                        </form>
                        </div>
                        </div>
                    )
                })
            }
            
        </div>
        </>
    )

        }

        else{
            return(
                <>
                <div classname="loading">
                    Loading....
                </div>
                </>
            )
        }
}

export default SubscribedUserPost;