import React, { useState, useEffect } from "react";
import desktop from "./asset/desktop.png";
import mobile from "./asset/mobile.png";
import chatting from "./asset/chatting.svg";
import "./About.css";
import { useNavigate } from "react-router-dom";
const About = () => {
  const [checker, setChecker] = useState({ navigation: false });
  const [width, setwidth] = useState(window.innerWidth);
  const Navigation = useNavigate();
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
            alt="navigation"
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
            <button onClick={() => Navigation("/login")}>get Started</button>
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
        <h1 className="heading_tag">About</h1>
        <div className="about">
          <div className="logo">
            <img src={chatting} alt="chatting" />
          </div>
          <div className="contents">
            <div id="text">
              <h1>
                Embrace the power of connection and dive into endless
                conversations.
              </h1>
              <p>
                Step into our vibrant social chat platform, where connections
                flourish. Follow fascinating individuals and engage in enriching
                conversations. Experience the thrill of meeting new friends and
                exchanging ideas. Join our community today and embark on a
                journey of discovery through meaningful interactions. Let's
                connect, chat, and create lasting memories together!
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="support">
        <h1>Support</h1>
        <div id="text">
          <h1>Follow & Build Site</h1>
          <p>
            For assistance, utilize our GitHub support page to access
            repositories, commit changes, and craft your unique site. Our
            comprehensive resources and community guidance ensure smooth
            navigation and seamless development. Join our support network on
            GitHub today and unleash your creativity in building your own site!
          </p>
        </div>
        <div className="support">
          <a
            className="repository"
            href="https://github.com/sivaprasath2004/social-media-application"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/6878/6878122.png"
              alt="github"
            />
            <p>Repository</p>
          </a>
          <a className="github" href="https://github.com/sivaprasath2004">
            <img
              src="https://cdn-icons-png.flaticon.com/128/2111/2111432.png"
              alt="github"
            />
            <p>Github</p>
          </a>
        </div>
      </section>
      <section id="contact">
        <h1>Contact</h1>
        <div id="text">
          <h1>Experience & Guidance</h1>
          <p>
            If you encounter any issues or have questions, please don't hesitate
            to reach out to us. Your satisfaction is our priority, and we're
            here to assist you every step of the way. Contact us anytime for
            prompt and reliable support.Your feedback is invaluable to us, and
            we're committed to resolving any concerns you may have promptly.
          </p>
        </div>
        <div className="support">
          <a href="mailto:prasathsiva2004@gmail.com">
            <img
              src="https://cdn-icons-png.flaticon.com/128/6244/6244710.png"
              alt="mail"
            />
            <p>prasathsiva2004@gmail.com</p>
          </a>
          <a href="https://in.linkedin.com/in/sivaprasath2004">
            <img
              src="https://cdn-icons-png.flaticon.com/128/1384/1384014.png"
              alt="linkedin"
            />
            <p>linkedin</p>
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
