import React, { useState, useEffect } from "react";
import desktop from "./asset/desktop.png";
import mobile from "./asset/mobile.png";
import chatting from "./asset/chatting.svg";
import "./About.css";
import { useNavigate } from "react-router-dom";

const About = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const Navigation = useNavigate();

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="home_Page">
      {/* ── NAV ── */}
      <nav>
        <h1>Zodia</h1>

        {width < 660 && (
          <img
            src={
              navOpen
                ? "https://cdn-icons-png.flaticon.com/128/2732/2732657.png"
                : "https://cdn-icons-png.flaticon.com/128/4254/4254068.png"
            }
            className="navigation_button"
            alt="menu"
            onClick={() => setNavOpen((p) => !p)}
            style={{ position: "relative", zIndex: 102, height: 26, width: 26 }}
          />
        )}

        <div
          id={navOpen ? "view" : "nav"}
          style={{ height: width < 660 ? "100vh" : "" }}
          onClick={() => width < 660 && setNavOpen(false)}
        >
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#support">Support</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home">
        <div className="contents">
          <div id="text">
            <h1>Connect and Chat Every Moment with Us</h1>
            <p>
              Join the Zodia community — follow people, spark conversations, and
              dive into a world of meaningful connections. Real‑time messaging,
              no limits.
            </p>
            <div className="about-chips">
              <span className="chip">💬 Real-time Chat</span>
              <span className="chip">👥 Follow Anyone</span>
              <span className="chip">🔔 Notifications</span>
            </div>
            <button onClick={() => Navigation("/login")}>Get Started →</button>
          </div>
        </div>
        <div className="logo">
          <img
            className={width < 660 ? "mobile" : "desktop"}
            src={width < 660 ? mobile : desktop}
            alt="app preview"
          />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about">
        <p className="heading_tag">About</p>
        <h1>Built for meaningful connections</h1>
        <div className="about">
          <div className="logo">
            <img src={chatting} alt="chatting illustration" />
          </div>
          <div className="contents">
            <div id="text">
              <h1>Embrace the power of connection.</h1>
              <p>
                Step into a vibrant social platform where connections flourish.
                Follow fascinating people, engage in enriching conversations,
                and experience the thrill of meeting new friends. Join today and
                embark on a journey of discovery through meaningful interactions.
              </p>
              <div className="about-chips">
                <span className="chip">⚡ Instant messaging</span>
                <span className="chip">🌐 Global community</span>
                <span className="chip">🔒 Private rooms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUPPORT ── */}
      <section id="support">
        <h1>Support</h1>
        <div id="text">
          <h1>Open Source & Community‑Driven</h1>
          <p>
            Access the full source code on GitHub, fork the repository, open
            issues, or contribute pull requests. Our comprehensive resources
            and community guidance ensure smooth navigation and seamless
            development.
          </p>
        </div>
        <div className="support">
          <a href="https://github.com/sivaprasath2004/social-media-application">
            <img src="https://cdn-icons-png.flaticon.com/128/6878/6878122.png" alt="github" />
            <div>
              <p>Repository</p>
              <span style={{ fontSize: ".75rem", color: "var(--gray-400)" }}>Source code & issues</span>
            </div>
          </a>
          <a href="https://github.com/sivaprasath2004">
            <img src="https://cdn-icons-png.flaticon.com/128/2111/2111432.png" alt="github" />
            <div>
              <p>GitHub Profile</p>
              <span style={{ fontSize: ".75rem", color: "var(--gray-400)" }}>More projects</span>
            </div>
          </a>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact">
        <h1>Contact</h1>
        <div id="text">
          <h1>We're here to help</h1>
          <p>
            Encountered an issue or have a suggestion? Reach out — your
            feedback is invaluable and we're committed to resolving any
            concerns promptly.
          </p>
        </div>
        <div className="support">
          <a href="mailto:prasathsiva2004@gmail.com">
            <img src="https://cdn-icons-png.flaticon.com/128/6244/6244710.png" alt="email" />
            <div>
              <p>Email</p>
              <span style={{ fontSize: ".75rem", color: "var(--gray-400)" }}>prasathsiva2004@gmail.com</span>
            </div>
          </a>
          <a href="https://in.linkedin.com/in/sivaprasath2004">
            <img src="https://cdn-icons-png.flaticon.com/128/1384/1384014.png" alt="linkedin" />
            <div>
              <p>LinkedIn</p>
              <span style={{ fontSize: ".75rem", color: "var(--gray-400)" }}>Connect professionally</span>
            </div>
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <p>© 2024 Zodia · Built with React & Socket.io</p>
        <p style={{ fontSize: ".8rem", color: "var(--gray-400)" }}>
          <a href="#about" style={{ color: "inherit", textDecoration: "none", marginRight: "1rem" }}>About</a>
          <a href="https://github.com/sivaprasath2004" style={{ color: "inherit", textDecoration: "none" }}>GitHub</a>
        </p>
      </footer>
    </div>
  );
};

export default About;
