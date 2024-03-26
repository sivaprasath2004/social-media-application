import React,{useEffect, useState} from 'react'
import io from 'socket.io-client'
import axios from 'axios'
const DynamicContainer =({onUpdate}) => {
  let socket
  let Id=onUpdate.id
  let name=onUpdate.name
  console.log(onUpdate.id)
  const [checker,setChecker]=useState({})
  useEffect(()=>{
   const search=async()=>{
    if(checker?.input?.length===1){
     let res=await axios.post('http://localhost:5000/searchResult',{
      val:checker.input
     })
     console.log(res.data)
     setChecker(pre=>({...pre,users:res.data}))
    }
    else{
      console.log("no more")
      console.log(checker?.input)
    }
   }
   search()
  },[checker.input])
  function handleFollow(id){
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
          <h1>{item?.user_name[0]}</h1>
          </div>
          <div key={`name${index}`} id='USER_NAME'>
          <h1>{item?.user_name.length>25?item.user_name.slice(0,25)+'..':item.user_name}</h1>
          <p style={{fontSize:'0.9rem',fontWeight:600}}>{item.Des}</p>
        </div>
        </div>
        <button key={`user_Follow_Button${index}`} id='user_Follow_Button' onClick={()=>handleFollow(item._id)}>Follow</button>
        </div>

      ))
    }
    </>
  )
}

export default DynamicContainer