import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Cookies from 'universal-cookie'
const cookies=new Cookies()
const App = () => {
  console.log(cookies.get('cookies'))
  return (
    // <Home />
    <Login />
  )
}

export default App