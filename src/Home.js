import React,{useState,useEffect} from 'react'
import "./Home.css"
import DynamicContainer from './DynamicContainer'
import Cookies from 'universal-cookie'
import io from 'socket.io-client'
import Followers from './followers'
import { useNavigate } from 'react-router-dom'
const Home = () => {
  let socket
  const navigation=useNavigate()
  const cookies=new Cookies()
  const [checker,setChecker]=useState({dark:true,switched:"none",name:" ",Des:" "})
  useEffect(()=>{
    let user=cookies.get("user_login_advantages")
    let name=cookies.get("user_name_advantages")
    let Des=cookies.get("user_Description") 
    if(!user && !name){
      navigation('/login')
    }else{setChecker(pre=>({...pre,name:name,id:user,Des:Des?Des:"Add Your Description"}))}
  },[])
  socket=io('http://localhost:5000')
  socket.emit('join',{me:checker.id,name:checker.name},err=>{
    console.log(err)
  })
  socket.on('follower',msg=>{
    if(msg){
      let mess
      if(checker.notify){
       mess=[]
      }
      checker.switched==="Add Friend"?null:setChecker(pre=>({...pre,notify:msg}))
    }
  })
  return (
    <div id="home_page">
       <div id='profile_container'>
       <h1>{checker?.name[0]}</h1>
       <div id='User_settings'>
       <img style={{filter:checker.switched==="friends"?"brightness(0) saturate(100%) invert(84%) sepia(73%) saturate(1725%) hue-rotate(108deg) brightness(106%) contrast(105%)":""}} src='https://cdn-icons-png.flaticon.com/128/880/880594.png' alt='friends' onClick={()=>setChecker(pre=>({...pre,switched:"friends"}))}/>
       <img style={{filter:checker.switched==="Add Friend"?" brightness(0) saturate(100%) invert(84%) sepia(73%) saturate(1725%) hue-rotate(108deg) brightness(106%) contrast(105%)":''}} src='https://cdn-icons-png.flaticon.com/128/9055/9055030.png' alt='Add Friend' onClick={()=>setChecker(pre=>({...pre,switched:"Add Friend"}))}/>
       <img style={{filter:checker.switched==="settings"?" brightness(0) saturate(100%) invert(84%) sepia(73%) saturate(1725%) hue-rotate(108deg) brightness(106%) contrast(105%)":''}} src='https://cdn-icons-png.flaticon.com/128/15360/15360026.png' alt='settings' onClick={()=>setChecker(pre=>({...pre,switched:"settings"}))}/>
       </div>
       <div id='dark_Light_mode'>
       <img src={checker.dark?'https://cdn-icons-png.flaticon.com/128/66/66275.png':'https://cdn-icons-png.flaticon.com/128/4584/4584492.png'} alt='sun' onClick={()=>{
        document.body.classList.toggle('dark');
        setChecker(pre=>({...pre,dark:!checker.dark}))
        }} />
       </div>
       </div>
       <div id='FriendList_container'>
      <div id='my_profile'>
        <div id="logo">
          <h1>{checker?.name[0]}</h1>
        </div>
        <div id="my_name">
          <h1>{checker?.name.length>20?checker.name.slice(0,20)+'..':checker.name}</h1>
          <h2>{checker.Des.length>20?checker.Des.slice(0,20)+'..':checker.Des}</h2>
        </div>
      </div>
      <div id='border_line'></div>
      <div id='user_search'>
      <div id='search'>
        <input id='special' type="text" onChange={(e)=>setChecker(pre=>({...pre,search:e.target.value}))} placeholder='search'/>
        <img src='https://cdn-icons-png.flaticon.com/128/2811/2811790.png' alt='search' />
      </div>
      <img id='add_icon' src='https://cdn-icons-png.flaticon.com/128/9312/9312231.png' alt="add" />
      </div>
      <div id='border_line'></div>
       </div>
       <div id="dynamic_container"> 
       {checker.switched==="Add Friend"?
        <Followers onUpdate={{id:checker.id,name:checker.name}} />
        :<DynamicContainer onUpdate={{id:checker.id,name:checker.name}} />
      }
       </div>
    </div>
  )
}

export default Home