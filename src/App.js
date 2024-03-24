import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Home from './Home'
import About from './About'
import Login from './Login'
import Cookies from 'universal-cookie'
const cookies=new Cookies()
const App = () => {
  let login=cookies.get("user_login_advantages")
  console.log(login)
  return (
    <Routes>
      <Route path='/' element={<About/>} />
    <Route path='/home' element={<Home/>}/>:
    <Route path='/login' element={<Login/>} />
    </Routes>
  )
}

export default App