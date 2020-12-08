import React, { useState,useContext } from 'react';
import {UserContext} from '../../App'
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';


const ForgotPassword=()=>{

    const history=useHistory()
    const [email,setEmail]=useState('')
    const sendmail=(emailval)=>{
        
        if(!/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(emailval))
        {
           return M.toast({html:"Please enter a valid email address!!",classes:"red"});

           //iski placement sahi karni hai
        }
        if(emailval)
        {
        console.log(emailval);
        fetch('/forgotpassword',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:emailval
            })
        })
        .then(res=>res.json())
        .then(emailresults=>{
            console.log("email results",emailresults);
            if(!emailresults.error)
            {
            M.toast({html:"A password reset link has been sent to your Mail!!",classes:"green"})
            setEmail('');
            history.push('/login')
            }

            else
            {
                M.toast({html:emailresults.error,classes:"red"})
            }
        })
        .catch(err=>{
            console.log(err);
        })

    
        
    }//end if

    else
    {
        M.toast({html:"Please enter the required field!!",classes:"red"})
    }
}
    return(
        <>
        <div style={{padding: "5em",
                    width: "40%",
                    margin: "8em auto",border:"2px solid dodgerblue"}}>
            
            <input type="text" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email.."/>
            <div style={{textAlign:"center"}}>
            <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={()=>{sendmail(email)}}>Reset Password
            <i className="material-icons right"></i>
            </button>
            </div>

        </div>
        
        </>
    )
}

export default ForgotPassword;