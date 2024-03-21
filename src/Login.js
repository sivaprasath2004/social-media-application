import React,{useState} from 'react'
import './Login.css'
import Cookies from 'universal-cookie'
const Login = () => {
    const cookies=new Cookies()
    const [values,setValues]=useState({})
    function handleSubmit(){
        cookies.set('cookies',"selected",{path:'/'})
        console.log("clicked")
    }
  return (
    <main>
        <div id='login'>
            <input type='text' onChange={(e)=>setValues(pre=>({...pre,name:e.target.value}))} placeholder='name' />
            <input type='text' onChange={(e)=>setValues(pre=>({...pre,pass:e.target.value}))} placeholder='password'/>
            <div id='Submit_form'>
            <button onClick={()=>handleSubmit()}>Login</button>
            </div>
        </div>
    </main>
  )
}

export default Login