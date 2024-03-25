import React,{useEffect, useState} from 'react'
import axios from 'axios'
const DynamicContainer =() => {
  const [checker,setChecker]=useState({})
  useEffect(()=>{
   const search=async()=>{
    if(checker.input){
     let res=await axios.post('http://localhost:5000/searchResult',{
      val:checker.input
     })
     console.log(res)
    }
    else{
      console.log("no more")
    }
   }
   search()
  },[checker.input])
  return (
    <>
    <div id='global_search'>
    <img src='https://cdn-icons-png.flaticon.com/128/2811/2811790.png' alt='search' />
    <input id='special' type='text' onChange={(e)=>setChecker(pre=>({...pre,input:e.target.value}))} placeholder='search'/>
    </div>
    </>
  )
}

export default DynamicContainer