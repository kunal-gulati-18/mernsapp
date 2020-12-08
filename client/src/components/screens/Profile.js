import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../../App'


const Profile=()=>{

    const {state,dispatch}=useContext(UserContext);
    const [data,setData]=useState([]);
    const [userdata,setUserData]=useState('');
    const tokenval=localStorage.getItem('jwt');
    useEffect(()=>{
        console.log('rgrwg',state);
        fetch('/viewmypost',{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+tokenval
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log('profile',result.results)
            // if(result.results=="No post found!!")
            // {
            //     setData([]);
            // }
            // else{
                setData(result.results);
            
                

        })
        .catch(err=>{
            console.log(err);
        })

        fetch('/userdata',{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+tokenval
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log('user data in profile',result)
            setUserData(result);

        })
        .catch(err=>{
            console.log(err);
        })



    },[])

    const updatepicture=(file)=>{

        if(file)
        {
            const data=new FormData();  //as we are uploading a file
            data.append("file",file);
            data.append("upload_preset","Insta-Clone");
            data.append("cloud_name","dqkkq9abg");
    
            fetch("https://api.cloudinary.com/v1_1/dqkkq9abg/image/upload",{
    
                method:"POST",
                body:data
                })
                .then(res=>res.json())
                .then(data=>{
                console.log('cloduinary response',data.url);

                fetch('/updatepicture',{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+tokenval
                    },

                    body:JSON.stringify({
                        image:data.url
                    })
                })
                .then(res=>res.json())
                .then(updateresult=>{
                    console.log("picture updated",updateresult)
                    setUserData(updateresult);
                    localStorage.setItem("user",JSON.stringify({...state,image:data.url})
                    )
                    dispatch({type:"UPDATEUSERPICTURE",payload:updateresult.image})


                })

                });


           
        }

    }
    if(data!="No post found!!")
    {
    return(
        <>
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{display:"flex", justifyContent:"space-around",margin:"18px 0px", borderBottom:"1px solid gray"}}>
            <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                src={userdata.image}
                />
                <div>
                <div className="file-field input-field">
        <div className="btn blue">
        <span>Update Image</span>
        <input type="file" onChange={(e)=>updatepicture(e.target.files[0])} id="filename"/>
        
        </div>
        
        <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
        
        </div>
        </div>
                </div>
            </div>

            <div>
            <h4>{state?state.name:"loading"}</h4>
            <h5>{state?state.email:"loading"}</h5>
            <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                <h6>{data.length} Posts</h6>
                <h6>{userdata?userdata.followers.length:"loading.."} Followers</h6>
                <h6>{userdata?userdata.following.length:"loading.."} Following</h6>
            </div>
            </div>
        </div>
        
        
        <div className="gallery">
            {
              
                data.map(item=>{

                    return(
                        <img className="item" src={item.photo} key={item._id} alt={item.title}/>
           
                    )
                })
               
            }
            
            
        </div>
        
        </div>


        </>
    )

        }

        else
        {
            return(
                <>
                <div style={{maxWidth:"550px",margin:"0px auto"}}>
                    <div style={{display:"flex", justifyContent:"space-around",margin:"18px 0px", borderBottom:"1px solid gray"}}>
                    <div>
                        <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                        src={userdata.image}
                        />
                         <div>
                <div className="file-field input-field">
        <div className="btn blue">
        <span>Update Image</span>
        <input type="file" onChange={(e)=>updatepicture(e.target.files[0])} id="filename"/>
        
        </div>
        
        <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
        
        </div>
        </div>
                </div>
                    </div>
        
                    <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                        <h6>0 Posts</h6>
                        <h6>{userdata?userdata.followers.length:"loading.."} Followers</h6>
                        <h6>{userdata?userdata.following.length:"loading.."} Following</h6>
                    </div>
                    </div>
                </div>
                
                
                <div className="gallery">
                  <h5> No Posts Found!! </h5>
                </div>
                
                </div>
        
        
                </>
        
            )
        }
}


export default Profile;