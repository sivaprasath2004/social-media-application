import React,{useState,useEffect} from 'react'
import "./Home.css"
import DynamicContainer from './DynamicContainer'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'
const Home = () => {
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
  return (
    <div id="home_page">
       <div id='profile_container'>
       <h1>{checker?.name[0]}</h1>
       <div id='User_settings'>
       <img style={{filter:checker.switched==="friends"?"brightness(0) saturate(100%) invert(84%) sepia(73%) saturate(1725%) hue-rotate(108deg) brightness(106%) contrast(105%)":""}} src='https://cdn-icons-png.flaticon.com/128/880/880594.png' alt='friends' onClick={()=>setChecker(pre=>({...pre,switched:"friends"}))}/>
       <img style={{filter:checker.switched==="message"?" brightness(0) saturate(100%) invert(84%) sepia(73%) saturate(1725%) hue-rotate(108deg) brightness(106%) contrast(105%)":''}} src='https://cdn-icons-png.flaticon.com/128/3114/3114735.png' alt='message' onClick={()=>setChecker(pre=>({...pre,switched:"message"}))}/>
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
        <DynamicContainer/>
       </div>
    </div>
  )
}

export default Home