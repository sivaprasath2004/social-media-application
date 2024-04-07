import React, { useState, useEffect } from "react";
import desktop from "./asset/desktop.png";
import mobile from "./asset/mobile.png";
import "./About.css";
const About = () => {
  const [checker, setChecker] = useState({ navigation: false });
  const [width, setwidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => setwidth(window.innerWidth));
  }, []);
  return (
    <div className="home_Page">
      <nav>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "60%",
          }}
        >
          <h1>Zodia</h1>
        </div>
        {width < 660 ? (
          <img
            style={{ position: "relative", zIndex: 2, height: 30, width: 30 }}
            src={
              checker.navigation
                ? "https://cdn-icons-png.flaticon.com/128/2732/2732657.png"
                : "https://cdn-icons-png.flaticon.com/128/4254/4254068.png"
            }
            className="navigation_button"
            onClick={() =>
              setChecker((pre) => ({ ...pre, navigation: !checker.navigation }))
            }
          />
        ) : (
          <></>
        )}
        <div
          className="nav"
          id={checker.navigation ? "view" : "nav"}
          style={{ height: width < 660 ? window.innerHeight : "" }}
        >
          <a href="#about">About</a>
          <a href="#support">Support</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>
      <section id="home">
        <div className="contents">
          <div id="text">
            <h1>Connect and Chat Every Moments with Us! </h1>
            <p>
              Join our ZODIA community, follow and connect with people, and
              immerse yourself in an unlimited world of connecting with others.
            </p>
            <button>get Started</button>
          </div>
        </div>
        <div className="logo">
          <img
            className={width < 660 ? "mobile" : "desktop"}
            src={width < 660 ? mobile : desktop}
            alt="desktop"
          />
        </div>
      </section>
      <section id="about">
        <h1>About</h1>
        <p></p>
      </section>
    </div>
  );
};

export default About;
