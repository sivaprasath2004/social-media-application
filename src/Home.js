import React,{useState} from 'react'
import "./Home.css"
import DynamicContainer from './DynamicContainer'
const Home = () => {
  const [checker,setChecker]=useState({dark:true,switched:"none"})
  return (
    <main>
       <div id='profile_container'>
       <h1>M</h1>
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
          <h1>M</h1>
        </div>
        <div id="my_name">
          <h1>Siva</h1>
          <h2>Description</h2>
        </div>
      </div>
      <div id='border_line'></div>
       </div>
       <div id="dynamic_container"> 
        <DynamicContainer/>
       </div>
    </main>
  )
}

export default Home