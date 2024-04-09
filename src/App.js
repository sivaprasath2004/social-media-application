import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Login from "./Login";
import Message from "./Message";
import { useNavigate } from "react-router-dom";
import Navigate from "./Navigate";
const App = () => {
  const [values, setValues] = useState({});
  const Navigation = useNavigate();
  useEffect(() => {
    let redirect = Navigate();
    if (redirect.red === "redirect") {
      Navigation("/home");
      setValues({
        name: redirect.name,
        user: redirect.user,
        Des: redirect.Des,
      });
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route
        path="/home"
        element={
          <Home name={values?.name} user={values?.user} Des={values?.Des} />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/message" element={<Message />} />
    </Routes>
  );
};

export default App;
