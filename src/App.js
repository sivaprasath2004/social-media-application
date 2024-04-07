import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Login from "./Login";
import Message from "./Message";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/message" element={<Message />} />
    </Routes>
  );
};

export default App;
