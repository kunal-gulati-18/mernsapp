import React, {useEffect,createContext,useReducer,useContext} from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Route,useHistory} from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscribedUserPost from './components/screens/SubscribedUserPost';
import ForgotPassword from './components/screens/ForgotPassword';
import ResetPassword from './components/screens/ResetPassword';
import SearchUser from './components/screens/SearchUser';
import {intialState,reducer} from './reducer/userReducer';
{/* useReducer is similar to useState and we use useReducer with context*/}
export const UserContext=createContext();

const Routing=()=>{

  const history=useHistory();
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{

    const user=JSON.parse(localStorage.getItem("user"))
    console.log(user);
    if(user)
    {
      {/*used agar jo user hai vo logout na kare and screen band karde bas*/}

      dispatch({type:"USER",payload:user})  
      
      history.push('/')
    }

    else{
      
      if(!history.location.pathname.startsWith("/forgotpassword"))
        history.push('/login')
        
      
    }

  },[])  

  return(
  <>
  <Route exact path='/'>
      <Home/>
    </Route>
    <Route path='/login'>
      <Login/>
    </Route>
    <Route path='/signup'>
      <Signup/>
    </Route>
    <Route exact path='/profile'>
      <Profile/>
    </Route>
    <Route path='/createpost'>
      <CreatePost/>
    </Route>
    <Route path='/profile/:userid'>
      <UserProfile/>
    </Route>

    <Route path='/myfollowingpost'>
      <SubscribedUserPost/>
    </Route>
    <Route exact path="/forgotpassword">
    <ForgotPassword/>
    </Route>

    <Route path="/forgotpassword/:token">
     <ResetPassword/>
    </Route>

    <Route path='/search'>
    <SearchUser/>
    </Route>
 
  </>
  );
}
function App() {
  const[state,dispatch]=useReducer(reducer,intialState);
  
  {/*useEffect only runs once due to presence of empty array */}
  {/*dispatch to update central state */}
  return (
    <>
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar/>
    <Routing/>  {/* now routing browser router ke andar hai hence we can use history in this*/}
    </BrowserRouter>
    </UserContext.Provider>
    </>
  );
}

export default App;
