import React,{useState} from 'react';
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css';
const Signup=()=>{
    const history=useHistory();
    const [name,setName]=useState('');
    const[email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [image,setImage]=useState('');
    const [url,setUrl]=useState('');
    const Postdata=()=>{
    
        if(!/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email))
        {
           return M.toast({html:"Please enter a valid email address!!",classes:"red"});

           //iski placement sahi karni hai
        }

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
            console.log('cloduinary response',data);
            setUrl(data.url);
            
            if(!data.error)
            {
                console.log('no error');
            fetch("/signup",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name,
                email,
                password,
                image:data.url
                


            })


            }).then(res=>res.json())
            .then(finaldata=>{
            console.log('signup data response',finaldata);
            if(finaldata.error)
            {
                M.toast({html:finaldata.error,classes:"red"});
            }

            else
            {
                M.toast({html:finaldata.message,classes:"green"});
                setName('');
                setEmail('');
                setPassword('');
                setImage('');
                history.push('/login');
                
            }

            

        })
        .catch(err=>{
            console.log(err);
        })

    }

    else{
        // M.toast({html:"Signing you up..",classes:"green"});
        
        fetch("/signup",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name,
                email,
                password,
                image:'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
                


            })


            }).then(res=>res.json())
            .then(finaldata=>{
            console.log('signup data response',finaldata);
            if(finaldata.error)
            {
                M.toast({html:finaldata.error,classes:"red"});
            }

            else
            {
                M.toast({html:finaldata.message,classes:"green"});
                setName('');
                setEmail('');
                setPassword('');
                setImage('');
                history.push('/login');
                
            }

            

        })
        .catch(err=>{
            console.log(err);
        })

    }
           
        })
        .catch(err=>{
            console.log(err);
        })

    
    }
    return(
        <>
        <div className="mycard input-field">
            <div className="card authcard">
            <h2>Mernsapp</h2>
            <input type="text" id="uname" placeholder="Enter username.." value={name} onChange={(e)=>setName(e.target.value)}/> 
            <input type="email" id="uemail" placeholder="Enter email.." value={email} onChange={(e)=>setEmail(e.target.value)}/> 
            <input type="password" id="upassword" placeholder="Enter password.." value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <div className="file-field input-field">
        <div className="btn blue">
        <span>Upload Image</span>
        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
        </div>
        </div>
            <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={Postdata}>Signup
            <i className="material-icons right"></i>
            </button>
            <div className="account-present">Already have an account?<Link to="/login" className="login-color">Login</Link></div>
            </div>
        </div>
        </>
    )
}


export default Signup;