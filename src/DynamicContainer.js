import React,{useEffect, useState} from 'react'
import io from 'socket.io-client'
import axios from 'axios'
const DynamicContainer =({onUpdate}) => {
  let socket
  let Id=onUpdate.id
  let name=onUpdate.name
  console.log(onUpdate.id)
  const [checker,setChecker]=useState({})
  const [Following,setFollowing]=useState([])
  useEffect(()=>{
   const search=async()=>{
    if(checker?.input?.length===1){
     let res=await axios.post('http://localhost:5000/searchResult',{
      val:checker.input
     })
     let follow=await axios.post('http://localhost:5000/followings',{
       id:Id,
       section:'no'
     })
    console.log('follow',follow)
    console.log('finish')
     console.log(res.data)
     setChecker(pre=>({...pre,users:res.data,followers:follow.data}))
     follow.data.following.map(item=>setFollowing(pre=>[...pre,item]))
    }
    else{
      console.log("no more")
      console.log(checker?.input)
    }
   }
   search()
  },[checker.input])
  function handleFollow(id,index){
    setFollowing(pre=>[...pre,id])
     socket=io('http://localhost:5000')
     socket.emit('follow',{me:Id,you:id,name},err=>{
      if(err){
        console.log(err)
      }
     })
  }
  return (
    <>
    <div id='global_search'>
    <img src='https://cdn-icons-png.flaticon.com/128/2811/2811790.png' alt='search' />
    <input id='special' type='text' onChange={(e)=>setChecker(pre=>({...pre,input:e.target.value}))} placeholder='search'/>
    </div>
    {
      checker?.users?.map((item,index)=>(
        <div key={`parent_tag${index}`} id='User_Profile'>
        <div key={`User_Details_${index}`} id='User_Details' >
          <div key={`logo_${index}`} id='User_Logo'>
          <h1>{item?.name[0]}</h1>
          </div>
          <div key={`name${index}`} id='USER_NAME'>
          <h1>{item?.name.length>25?item.name.slice(0,25)+'..':item.name}</h1>
          <p style={{fontSize:'0.9rem',fontWeight:600}}>{item.Des}</p>
        </div>
        </div>
        {Object.values(Following).includes(item._id)?
        <button key={`user_Following_Button${index}`} id='following_butt' >Following</button>
        :
        checker.followers.followers.includes(item._id)?
        <button key={`user_Follow_Button${index}`} id='followed_butt'>Followed</button>
        :<button key={`user_Follow_Button${index}`} className='user_Follow_Button' id={`user_follow_butt${index}`} onClick={()=>handleFollow(item._id,index)}>Follow</button>
        }</div> 
      ))
    }
    </>
  )
}

export default DynamicContainer