import React, { useState,useContext } from 'react';
import {UserContext} from '../../App'
import {Link,useHistory,useParams} from 'react-router-dom';
import M from 'materialize-css';

const ResetPassword=()=>{

    const {token}=useParams();
    const history=useHistory();
    const [password,setPassword]=useState('');

    const resetpassword=()=>{
        if(password)
        {
        fetch("/resetpassword",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        })
        .then(res=>res.json())
        .then(results=>{
            console.log('results are',results)
            if(!results.error)
            {
                M.toast({html:results.message,classes:"green"})
                history.push('/login');
            }
            else
            {
                M.toast({html:results.error,classes:"red"})
                history.push('/login');
            }
        })
        }

        else
        {
            M.toast({html:"please enter the required field!!",classes:"red"})
        }
    }
    return(
        <>
        <div style={{padding: "5em",
                    width: "40%",
                    margin: "8em auto",border:"2px solid dodgerblue"}}>
            
            <input type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter New Password.."/>
            <div style={{textAlign:"center"}}>
            <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={resetpassword}>Update Password
            <i className="material-icons right"></i>
            </button>
            </div>

        </div>
        </>
    )
}

export default ResetPassword;