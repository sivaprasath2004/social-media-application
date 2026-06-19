import React, { useState, useRef } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

// ✅ Field moved OUTSIDE - no remount issue
const Field = ({ placeholder, type = "text", fieldRef }) => (
  <div id="input">
    <input
      type={type}
      placeholder={placeholder}
      ref={fieldRef}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.form?.requestSubmit()}
    />
  </div>
);

const Login = () => {
  const cookies = new Cookies();
  const navigation = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ useRef for all fields - no re-render on typing
  const nameRef = useRef();
  const usernameRef = useRef();
  const desRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();

  const login_user = (user) => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    cookies.set("user_login_advantages", user._id, { path: "/", expires: date });
    cookies.set("user_name_advantages", user.user_name, { path: "/", expires: date });
    if (user.Des) {
      cookies.set("user_Description", user.Des, { path: "/", expires: date });
    }
    navigation("/home");
  };

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const email = emailRef.current?.value;
    const pass = passRef.current?.value;

    if (isLogin) {
      if (email && pass) {
        const parts = email.split("@");
        if (parts[1]) {
          const res = await axios.post("https://social-media-application-backend.onrender.com/login", { email, pass });
          if (res.data.res === "ok") login_user(res.data.user);
          else setError(res.data.user);
        } else {
          setError("Invalid email address");
        }
      } else {
        setError("Please fill in all fields");
      }
    } else {
      const name = nameRef.current?.value;
      const username = usernameRef.current?.value;
      const Des = desRef.current?.value;

      if (name && username && email && pass && Des) {
        const parts = email.split("@");
        if (parts[1]) {
          const res = await axios.post("https://social-media-application-backend.onrender.com/signup", {
            name, username, email, Des, pass,
          });
          if (res.data.res === "ok") login_user(res.data.user);
          else setError(res.data.user);
        } else {
          setError("Invalid email address");
        }
      } else {
        setError("Please fill in all fields");
      }
    }

    setLoading(false);
  }

  return (
    <main>
      {loading && (
        <div id="loading_animation">
          <div className="loader" />
          <p>Please wait…</p>
        </div>
      )}

      <div id="login">
        <h1>{isLogin ? "Welcome back" : "Create account"}</h1>
        <p className="login-subtitle">
          {isLogin ? "Sign in to your Zodia account" : "Join the Zodia community today"}
        </p>

        {!isLogin && (
          <>
            <Field placeholder="Full name" fieldRef={nameRef} />
            <Field placeholder="Username" fieldRef={usernameRef} />
            <Field placeholder="Bio / Description" fieldRef={desRef} />
          </>
        )}

        <Field placeholder="Email address" fieldRef={emailRef} />
        <Field placeholder="Password" type="password" fieldRef={passRef} />

        <div id="Submit_form">
          <p className="error-msg">{error || " "}</p>
          <button onClick={handleSubmit}>
            {isLogin ? "Sign In →" : "Create Account →"}
          </button>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;