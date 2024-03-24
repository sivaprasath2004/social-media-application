import React,{useState} from 'react'
import './Login.css'
import axios from 'axios'
import Cookies from 'universal-cookie'
const Backend=process.env.BACKEND
const Login = () => {
  console.log(Backend)
    const cookies=new Cookies()
    const [values,setValues]=useState({login:true})
    const login_user=()=>{
      const date = new Date();
        date.setDate(date.getDate() + 15);
        cookies.set('cookies',"selected",{path:'/',expires:date})
        console.log("clicked")
    }
    async function handleSubmit(){
      if(values.login){
      if(values.email &&  values.pass){
        await axios.post('')
      }
    }
    else{
      console.log("signup")
    }
    }
  return (
    <main>
      {values.login?<div id='ball_1'></div>:<div id='ball_2'></div>}
      <div id='ball_3'></div>
        <div id='login'>
          {!values.login?
          <>
           <div id='input'>
           <input type='text' onChange={(e)=>setValues(pre=>({...pre,name:e.target.value}))} placeholder='name' />
           </div>
           <div id='input'>
           <input type='text' onChange={(e)=>setValues(pre=>({...pre,username:e.target.value}))} placeholder='User name' />
           </div>
           </>:<></>}
             <div id='input'>
            <input type='text' onChange={(e)=>setValues(pre=>({...pre,email:e.target.value}))} placeholder='E-mail' />
            </div>
            <div id='input'>
            <input type='text' onChange={(e)=>setValues(pre=>({...pre,pass:e.target.value}))} placeholder='password'/>
            </div>
            <div id='Submit_form'>
            <p style={{color:'red',textAlign:'center',fontSize:'.8rem'}}>Note:If you want to be Login Expires in 15 Days.</p>
            <p>{values.login?"I don't have a account ":"Already have a account "}<span style={{textDecoration:'underline',color:'blue',cursor:'pointer'}} onClick={()=>setValues(({login:!values.login}))}>{values.login?'Sign Up?':"Sign In?"}</span></p>
            <button onClick={()=>handleSubmit()}>{values.login?'Sign In':'Sign Up'}</button>
            </div>
        </div>
    </main>
  )
}

export default Login