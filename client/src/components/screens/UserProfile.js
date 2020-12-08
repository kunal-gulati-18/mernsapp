import React,{useState,useEffect,useContext} from 'react';
import {useParams} from 'react-router-dom'
import {UserContext} from '../../App'
import '../../App.css'

const UserProfile=()=>{

    const {state,dispatch}=useContext(UserContext);
    const [data,setData]=useState(null);
    
    const tokenval=localStorage.getItem('jwt');
    const {userid}=useParams();

    console.log('user id is',userid)
    const[followersdata,setFollowersData]=useState(state?!state.following.includes(userid):true);
    useEffect(()=>{
        fetch(`/users/${userid}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+tokenval
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log('UserProfile',result)
            console.log('UserProfile',result.user)
            setData(result);
            // setFollowersData(result.users);

        })
        .catch(err=>{
            console.log(err);
        })
    },[])

    const follow=(id)=>{

        fetch(`/follow/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+tokenval
            }
        })
        .then(res=>res.json())
        .then(results=>{
           console.log(results)
           dispatch({type:"UPDATE",payload:{following:results.following,followers:results.followers}})
           localStorage.setItem("user",JSON.stringify(results))
           setData((prevState)=>{
               return{
                   ...prevState,
                   user:{
                       ...prevState.user,
                       followers:[...prevState.user.followers,data._id]

                   }
               }
           })

           setFollowersData(false);
           
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const unfollow=(id)=>{

        fetch(`/unfollow/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+tokenval
            }
        })
        .then(res=>res.json())
        .then(results=>{
            console.log('unfollow',results.follo);
            dispatch({type:"UPDATE",payload:{following:results.following,followers:results.followers}})
           localStorage.setItem("user",JSON.stringify(results))
           setData((prevState)=>{
               //const newFollower=prevState.user.followers.filter(item=>item != data._id)
               //console.log('new follower',newFollower);
               return{
                   ...prevState,
                   user:{
                       ...prevState.user,
                       followers:results.followers

                   }
               }
           })

           setFollowersData(true);

           
            
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return(
        <>
        {data?
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
        <div style={{display:"flex", justifyContent:"space-around",margin:"18px 0px", borderBottom:"1px solid gray"}}>
        <div>
            <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
            src={data.user.image}
            />
        </div>

        <div>
        <h4>{data.user.name?data.user.name:"loading"}</h4>
        <h5>{data.user.email?data.user.email:"loading"}</h5>
        <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
            <h6>{data.posts.length} Posts</h6>
            <h6>{data.user.followers.length} Followers</h6>
            <h6>{data.user.following.length} Following</h6>

        </div>



        <div>
            {followersdata?  <button className="btn waves-effect waves-light blue button-bottom" type="submit" name="action" style={{marginBottom:"1em"}} onClick={()=>{follow(userid)}}>Follow
            </button>:<button className="btn waves-effect waves-light blue button-bottom" type="submit" name="action" style={{marginBottom:"1em"}} onClick={()=>{unfollow(userid)}}>Unfollow
            </button>}

           
       
            
           
        </div>
        </div>
       
    </div>
    
    <div className="gallery">
        {
            data.posts.map(item=>{

                return(
                    <img className="item" src={item.photo} key={item._id} alt={item.title}/>
       
                )
            })
        }
        
        
    </div>
    
    </div>

        :<h2>loading....</h2>}
        

        </>
    )
}


export default UserProfile;