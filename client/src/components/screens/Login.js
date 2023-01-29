import React, { useState,useContext } from 'react';
import {UserContext} from '../../App'
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Login=()=>{

    console.log('in login');
    const {state,dispatch}=useContext(UserContext);
    const history=useHistory();
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const SignIn=()=>{


        fetch("/logindetails",{

            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email,
                password
            })

        })
        .then(res=>res.json())
        .then(loginuserdetails=>{

            console.log(loginuserdetails);
            if(loginuserdetails.message)
            {
                M.toast({html:loginuserdetails.message,classes:"yellow"});
                return;
            }
            else if(loginuserdetails.success)
            {
                fetch("/signin",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        email,
                        password
                    })
                }).then(res=>res.json())
                .then((data)=>{
        
                    if(data.error)
                    {
                        M.toast({html:data.error,classes:"red"})
                        setEmail('');
                        setPassword('');
                        history.push('/login');
                    }
                    else{
                        console.log(data)
                        localStorage.setItem("jwt",data.token);
                        localStorage.setItem("user",JSON.stringify(data.user));
                        dispatch({type:"USER",payload:data.user})
                        M.toast({html:data.message,classes:"green"})
                        history.push('/');
        
                    }
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        })




        
    }

   
    return(
        <>
        <div className="mycard input-field">
            <div className="card authcard">
            <h2>Mernsapp</h2>
            <input type="text" id="uemail" placeholder="Enter email.." value={email} onChange={(e)=>setEmail(e.target.value)}/> 
            <input type="password" id="upassword" placeholder="Enter password.." value={password} onChange={(e)=>setPassword(e.target.value)}/>
            
            <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={SignIn}>Login
            <i className="material-icons right"></i>
            </button>
            <div className="account-present">Don't have an account?<Link to="/signup" className="signup-color">Signup</Link></div>
            <div><h6><Link to="/forgotpassword">Forgot your password?</Link></h6></div>
          
            </div>
        </div>
        </>
    )
}


export default Login;