import React,{useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';


const CreatePost=()=>{
    
    const history=useHistory();
    const [title,setTitle]=useState('');
    const[body,setBody]=useState('');
    const [image,setImage]=useState('');
    const [url,setUrl]=useState('');
    const tokenval=localStorage.getItem("jwt");
    const user=localStorage.getItem("user");
    useEffect(()=>{

        //yh tabhi chalega jab url update hoga
        if(url)
        {
        fetch("/createpost",{
            method:"POST",
            body:JSON.stringify({
                title,
                body,
                url
            }),

            headers:{
                "Authorization":"Bearer "+tokenval,
                "Content-Type":"application/json"

            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error)
            {
                M.toast({html:data.error,classes:"red"})
            }
            else
            {
                M.toast({html:data.message,classes:"green"})
                history.push('/');
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

  
    },[url])
    const createPost=()=>{

        const data=new FormData();  //as we are uploading a file
        data.append("file",image);
        data.append("upload_preset","Insta-Clone");
        data.append("cloud_name","dqkkq9abg");

        fetch("https://api.cloudinary.com/v1_1/dqkkq9abg/image/upload",{

        method:"POST",
        body:data
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            setUrl(data.url);
           
        })
        .catch(err=>{
            console.log(err);
        })

        

    }
    return(
        <>
        <div className="card createpost-card">

        <input type="text" placeholder="Enter title.." value={title} onChange={(e)=>setTitle(e.target.value)}/>
        <input type="text" placeholder="Enter body.." value={body} onChange={(e)=>setBody(e.target.value)}/>
        <div className="file-field input-field">
        <div className="btn blue">
        <span>Upload Image</span>
        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
        </div>
        </div>

        <button className="btn waves-effect waves-light green" type="submit" name="action" onClick={createPost}>Create
            <i className="material-icons"></i>
            </button>
        </div>
        </>

    );
}



export default CreatePost;