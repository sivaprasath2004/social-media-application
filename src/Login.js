import React, { useState, useEffect } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
const Login = () => {
  const cookies = new Cookies();
  const navigation = useNavigate();
  const [values, setValues] = useState({ login: true });
  const login_user = (user) => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    cookies.set("user_login_advantages", user._id, {
      path: "/",
      expires: date,
    });
    cookies.set("user_name_advantages", user.user_name, {
      path: "/",
      expires: date,
    });
    if (user.Des) {
      cookies.set("user_Description", user.Des, { path: "/", expires: date });
    }
    navigation("/home");
  };
  async function handleSubmit() {
    setValues((pre) => ({ ...pre, error: undefined, loading: true }));
    if (values.login) {
      if (values.email && values.pass) {
        let email_verify = values.email.split("@");
        if (email_verify[1]) {
          let res = await axios.post("http://localhost:5000/login", {
            email: values.email,
            pass: values.pass,
          });
          if (res.data.res === "ok") {
            login_user(res.data.user);
          } else {
            setValues((pre) => ({ ...pre, error: res.data.user }));
          }
        } else {
          setValues((pre) => ({ ...pre, error: "Invalid Mail Address" }));
        }
      }
    } else {
      if (
        values.name &&
        values.username &&
        values.email &&
        values.pass &&
        values.Des
      ) {
        let arr = values.email.split("@");
        if (arr[1]) {
          let res = await axios.post("http://localhost:5000/signup", {
            name: values.name,
            username: values.username,
            email: values.email,
            Des: values.Des,
            pass: values.pass,
          });
          if (res.data.res === "ok") {
            login_user(res.data.user);
          } else {
            setValues((pre) => ({ ...pre, error: res.data.user }));
          }
        } else {
          setValues((pre) => ({ ...pre, error: "Invalid Mail Address" }));
        }
      } else {
        setValues((pre) => ({ ...pre, error: "Fill the details" }));
      }
    }
    setValues((pre) => ({ ...pre, loading: undefined }));
  }
  return (
    <main>
      {values.login ? (
        <>
          <div id="ball_1"></div> <div id="ball_3"></div>
        </>
      ) : (
        <>
          <div id="ball_2"></div>
          <div id="ball_4"></div>
        </>
      )}
      {values.loading ? (
        <div id="loading_animation">
          <div className="loader"></div>
          <p style={{ fontSize: "1.3rem", color: "#f9ff00" }}>please wait...</p>
        </div>
      ) : (
        <></>
      )}
      <div
        id="login"
        style={{
          padding: values.login ? "padding: 4rem 2rem 2rem 2rem" : "2rem",
        }}
      >
        <h1>{values.login ? "Sign In" : "Sign Up"}</h1>
        {!values.login ? (
          <>
            <div id="input">
              <input
                type="text"
                onChange={(e) =>
                  setValues((pre) => ({ ...pre, name: e.target.value }))
                }
                placeholder="name"
              />
            </div>
            <div id="input">
              <input
                type="text"
                onChange={(e) =>
                  setValues((pre) => ({ ...pre, username: e.target.value }))
                }
                placeholder="User name"
              />
            </div>
            <div id="input">
              <input
                type="text"
                onChange={(e) =>
                  setValues((pre) => ({ ...pre, Des: e.target.value }))
                }
                placeholder="Description"
              />
            </div>
          </>
        ) : (
          <></>
        )}
        <div id="input">
          <input
            type="text"
            onChange={(e) =>
              setValues((pre) => ({ ...pre, email: e.target.value }))
            }
            placeholder="E-mail"
          />
        </div>
        <div id="input">
          <input
            type="text"
            onChange={(e) =>
              setValues((pre) => ({ ...pre, pass: e.target.value }))
            }
            placeholder="password"
          />
        </div>
        <div id="Submit_form">
          <p style={{ color: "red", textAlign: "center", fontSize: ".8rem" }}>
            {values.error ? values.error : " "}
          </p>
          <p>
            {values.login
              ? "I don't have a account "
              : "Already have a account "}
            <span
              style={{
                textDecoration: "underline",
                color: "blue",
                cursor: "pointer",
              }}
              onClick={() => setValues({ login: !values.login })}
            >
              {values.login ? "Sign Up?" : "Sign In?"}
            </span>
          </p>
          <button onClick={() => handleSubmit()}>
            {values.login ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Login;
