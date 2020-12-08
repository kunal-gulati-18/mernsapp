import React,{useContext,useEffect,useRef, useState} from 'react';
import {UserContext} from '../App'
import {Link,useHistory} from 'react-router-dom';  //prevents the page from refreshing again and again
import M from 'materialize-css';
import "../App.css"
const Navbar=()=>{
  const searchmodal=useRef(null);
  const opennav=useRef(null);
  const {state,dispatch}=useContext(UserContext);
  const [searchuserdata,setSearchUserData]=useState([]);
  const [searchname,setSearchName]=useState('');
  const[nouser,setNoUser]=useState('');
  console.log(state)
  var tokenval=localStorage.getItem('jwt');
  
  const history=useHistory();

  useEffect(()=>{
    M.Modal.init(searchmodal.current);
    M.Sidenav.init(opennav.current);

  },[])

  // useEffect(()=>{
  //   console.log("working!!")
  //   fetch('/getsearcheduser',{
  //     method:"POST",
  //     headers:{
  //       "Content-Type":"application/json",
  //       "Authorization":"Bearer "+tokenval
  //     },
  //     body:JSON.stringify({

  //       name:searchname
  //     })
  //   })
  //   .then(res=>res.json())
  //   .then(results=>{
  //     console.log(results);
  //     if(!results.error)
  //     {
  //       setSearchUserData(results.message);
  //     }

  //     else
  //     {
  //       setSearchUserData([]);
  //       setNoUser(results.error);
  //     }
      
  //   })
  // },[searchname])

  const getsearcheduser=()=>{

    if(searchname)
    {
        fetch('/getsearcheduser',{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+tokenval
          },
          body:JSON.stringify({

            name:searchname
          })
        })
        .then(res=>res.json())
        .then(results=>{
          console.log(results);
          if(!results.error)
          {
            setSearchUserData(results.message);
          }

          else
          {
            setSearchUserData([]);
            setNoUser(results.error);
          }
          
        })
    }

    else
    {
      M.toast({html:"Please fill the required field!!",classes:"red"})
    }

  }
  const logout=()=>{

    fetch('/deletelogindetails',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        email:state.email
      })



    })
    localStorage.clear();
    dispatch({type:'CLEAR'})
    history.push('/login');
    M.toast({html:"Logged out Successfully!!",classes:"red"})
    

  }

  const renderlist=()=>{
    if(state)
    {
      {/*means agar user ka data hua*/}
      return [
        <li key="1"><i className="material-icons modal-trigger" data-target="modal1">search</i></li>,
        <li key="2"><Link to="/profile">Profile</Link></li>,
        <li key="3"><Link to="/createpost">Create Post</Link></li>,
        <li key="4"><Link to="/myfollowingpost">My following Posts</Link></li>,
        <li key="5"><button className="btn waves-effect waves-light red" onClick={logout}>Logout</button></li>
      ]
    }

    else{

      return [
        <li key="6"><Link to="/login">Login</Link></li>,
        <li key="7"><Link to="/signup">Signup</Link></li>
      ]
    }
  }  

  const renderlist1=()=>{
    if(state)
    {
      {/*means agar user ka data hua*/}
      return [
        <li key="1"><i className="material-icons modal-trigger" data-target="modal1">search</i></li>,
        <li key="2"><Link to="/profile">Profile</Link></li>,
        <li key="3"><Link to="/createpost">Create Post</Link></li>,
        <li key="4"><Link to="/myfollowingpost">My following Posts</Link></li>,
        <li key="5" style={{marginLeft:"2.2em"}}><button className="btn waves-effect waves-light red hide-on-med-and-down" onClick={logout}>Logout</button></li>
      ]
    }

    else{

      return [
        <li key="6"><Link to="/login">Login</Link></li>,
        <li key="7"><Link to="/signup">Signup</Link></li>
      ]
    }
  } 
  return(
        <>
          <nav>
    <div className="nav-wrapper white" style={{color:"black"}}>
      <Link to={state?"/":"/login"} className="brand-logo">MernsApp</Link>
      
      <a data-target="mobile-demo" className="sidenav-trigger"><i class="material-icons">menu</i></a>
      {
        state?
        <div style={{marginLeft:"20em"}}><button style={{fontSize:"0.7em"}} className="btn waves-effect waves-light red valign-wrapper hide-on-large-only" onClick={logout}>Logout</button></div>:""}
      <ul id="nav-mobile listitems" className="right hide-on-med-and-down">
        {renderlist()}
      </ul>
    </div>
    {/*ref={searchmodal} mein reference chala gaya modal class ka */}
      <div id="modal1" className="modal" ref={searchmodal}>
    <div className="modal-content" style={{color:"black"}}>
      <div style={{color:"black",display:"flex"}}>
    <input type="text" placeholder="Enter username...." id='searchusername' value={searchname} onChange={(e)=>setSearchName(e.target.value)}/>
      <span><button  style={{backgroundColor:"white",border:"none",padding:"0px",borderRadius:"100%"}} onClick={getsearcheduser}><i className="material-icons">search</i></button></span>
      </div>
    
    {
      nouser?<div style={{textAlign:"center",fontSize:"1.2em",color:"indianred"}}>
      {nouser}
    </div>:
       searchuserdata.map(item=>{
        return(
        <div className="searchedusers" style={{display: "flex"}} key={item._id}>
      <img style={{width:"2.5em",height:"2.5em",borderRadius:"80px"}}
                src={item.image}/>

        <h5 className="searchnamestyle">{item.name}</h5>          
      </div>
        )
      })
    }
    
    </div>
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat">Close</button>
    </div>
  </div>

  </nav>
  <ul class="sidenav" id="mobile-demo" ref={opennav}>
    {renderlist1()}
  </ul>
        </>
    );
}


export default Navbar;