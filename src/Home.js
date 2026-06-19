import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Home.css";
import "./App.css";
import DynamicContainer from "./DynamicContainer";
import { io } from "socket.io-client";
import axios from "axios";
import Followers from "./followers";
import { useNavigate } from "react-router-dom";
import Message from "./Message";
import Settings from "./Settings";
import Navigate from "./Navigate";

// Single socket instance — outside component so it never re-creates
const socket = io("https://social-media-application-backend.onrender.com", { autoConnect: true });

const Home = () => {
  const navigate = useNavigate();
  const [checker, setChecker] = useState({
    dark:      false,
    switched:  "chats",
    menuBar:   false,
    results:   "none",
  });
  const [userData,   setUserData]   = useState(null); // current user's follow doc
  const [messagers,  setMessagers]  = useState([]);
  const [authInfo,   setAuthInfo]   = useState(null); // { user, name, Des }
  const [width,      setWidth]      = useState(window.innerWidth);

  // Resize listener
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Auth check + initial data load
  useEffect(() => {
    const ret = Navigate();
    if (ret.red === "no-redirect") {
      navigate("/login");
      return;
    }
    setAuthInfo({ user: ret.user, name: ret.name, Des: ret.Des });
    fetchData(ret.user);
  }, []);

  // Join personal socket room once authInfo is set
  useEffect(() => {
    if (!authInfo?.user) return;
    socket.emit("join", { me: authInfo.user, name: authInfo.name }, () => {});
  }, [authInfo?.user]);

  // Socket: follower / message notification → refresh data
  useEffect(() => {
    const handler = (msg) => {
      if (msg && authInfo?.user) fetchData(authInfo.user);
    };
    socket.on("follower", handler);
    return () => socket.off("follower", handler); // ✅ cleanup
  }, [authInfo?.user]);

  const fetchData = useCallback(async (uid) => {
    try {
      const res = await axios.post("https://social-media-application-backend.onrender.com/userId", { id: uid });
      const data = res.data;
      setUserData(data);
      if (data?.RoomId?.length) {
        const rooms = data.RoomId.map((i) => i.id);
        const users = await axios.post("https://social-media-application-backend.onrender.com/messagers", { ids: rooms });
        setMessagers(users.data || []);
      } else {
        setMessagers([]);
      }
    } catch (err) {
      console.error("fetchData error:", err);
    }
  }, []);

  const handleModes = () => {
    document.body.classList.toggle("dark");
    setChecker((p) => ({ ...p, dark: !p.dark }));
  };

  function searchResults(text) {
    if (!text) {
      setChecker((p) => ({ ...p, results: "none", search: "" }));
      return;
    }
    const filtered = messagers.filter((u) => u?.name?.includes(text));
    setChecker((p) => ({ ...p, results: filtered, search: text }));
  }

  function messagePageHandle(id, usr) {
    // id = the OTHER user's follow doc, usr = the OTHER user
    setChecker((p) => ({ ...p, messager: usr, switched: "message" }));
    // Refresh userData so roomId is up to date
    if (authInfo?.user) fetchData(authInfo.user);
  }

  async function removeNotification(item) {
    setChecker((p) => ({
      ...p,
      messager: item,
      switched: "message",
    }));
    // remove from local notification list
    setUserData((prev) => prev
      ? { ...prev, notification: prev.notification.filter((e) => e.id !== item.id) }
      : prev
    );
    await axios.post("https://social-media-application-backend.onrender.com/deleteMessage", {
      id: authInfo.user,
      item,
    });
  }

  function MessagerRow(item, index) {
    const hasNotif = userData?.notification?.find((e) => e.id === item?._id?.toString());
    return (
      <div
        key={`msg_row_${index}`}
        className="Messager_s"
        id="User_Details"
        onClick={() => removeNotification(item)}
      >
        {hasNotif && (
          <div className="notification_trued">
            <div />
            <p className="notification_time">{hasNotif.time?.split("/")?.[0]}</p>
          </div>
        )}
        <div id="User_Logo"><h1>{item?.name?.[0]}</h1></div>
        <div id="USER_NAME">
          <h1>{item?.name?.length > 22 ? item.name.slice(0, 22) + "…" : item?.name}</h1>
          <p style={{ fontSize: ".78rem", color: "var(--gray-500)" }}>{item?.Des}</p>
        </div>
      </div>
    );
  }

  const sw = checker.switched;
  const notification = userData?.notification || [];

  return (
    <div id="home_page">
      {/* ── MOBILE HEADER ── */}
      <div className={sw !== "message" && sw !== "settings" ? "header" : "header hided"}>
        <div id="name">
          <h1>Zodia</h1>
          <div
            id="menu"
            onClick={() => setChecker((p) => ({ ...p, menuBar: !p.menuBar }))}
          />
          <div
            className={checker.menuBar ? "menu_setting" : "menu_setting hiding"}
            onClick={() => setChecker((p) => ({ ...p, switched: "settings", menuBar: false }))}
          >
            <h1>⚙ Settings</h1>
          </div>
        </div>
        <div id="menu_tabs">
          {[
            { id: "chats",      icon: "https://cdn-icons-png.flaticon.com/128/8315/8315859.png", label: "Messages" },
            { id: "Add Friend", icon: "https://cdn-icons-png.flaticon.com/128/33/33308.png",     label: "Following" },
            { id: "search",     icon: "https://cdn-icons-png.flaticon.com/128/14247/14247188.png", label: "Find" },
          ].map((tab) => (
            <div
              key={tab.id}
              className={sw === tab.id ? "active" : ""}
              onClick={() => setChecker((p) => ({ ...p, switched: tab.id }))}
            >
              <img src={tab.icon} alt={tab.label} />
              <p>{tab.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <div id="profile_container">
        <h1>{authInfo?.name?.[0] ?? "U"}</h1>
        <div id="User_settings">
          {[
            { id: "friends",    src: "https://cdn-icons-png.flaticon.com/128/9055/9055030.png",   alt: "friends" },
            { id: "Add Friend", src: "https://cdn-icons-png.flaticon.com/128/880/880594.png",     alt: "following", hasNotif: notification.some((i) => i.notify !== "message") },
            { id: "settings",   src: "https://cdn-icons-png.flaticon.com/128/15360/15360026.png", alt: "settings" },
          ].map((tab) => (
            <div
              key={tab.id}
              className={tab.hasNotif ? "notification" : ""}
              onClick={() => setChecker((p) => ({ ...p, switched: tab.id }))}
              title={tab.alt}
            >
              <img src={tab.src} alt={tab.alt} style={sw === tab.id ? { opacity: 1 } : {}} />
            </div>
          ))}
        </div>
        <div id="dark_Light_mode">
          <img
            src={checker.dark
              ? "https://cdn-icons-png.flaticon.com/128/66/66275.png"
              : "https://cdn-icons-png.flaticon.com/128/4584/4584492.png"}
            alt="theme"
            onClick={handleModes}
          />
        </div>
      </div>

      {/* ── FRIEND / CHAT LIST ── */}
      <div className={sw === "chats" ? "FriendList_container" : "FriendList_container hided"}>
        <div id="my_profile">
          <div id="logo"><h1>{authInfo?.name?.[0]}</h1></div>
          <div id="my_name">
            <h1>{authInfo?.name?.length > 18 ? authInfo.name.slice(0, 18) + "…" : authInfo?.name}</h1>
            <h2>{authInfo?.Des?.length > 22 ? authInfo.Des.slice(0, 22) + "…" : authInfo?.Des}</h2>
          </div>
        </div>
        <div className="border_line first_line" />
        <div id="user_search">
          <div id="search">
            <input
              id="special"
              type="text"
              onChange={(e) => searchResults(e.target.value)}
              placeholder="Search messages…"
            />
            <img src="https://cdn-icons-png.flaticon.com/128/2811/2811790.png" alt="search" />
          </div>
          <img
            id="add_icon"
            src="https://cdn-icons-png.flaticon.com/128/9312/9312231.png"
            alt="find people"
            onClick={() => setChecker((p) => ({ ...p, switched: "search" }))}
            title="Find people"
          />
        </div>
        <div className="border_line" />
        <div id="messagers_container">
          {checker.results === "none"
            ? messagers.map((item, i) => MessagerRow(item, i))
            : checker.results.map((item, i) => MessagerRow(item, i))}
          {!messagers.length && (
            <div style={{ padding: "2rem 1rem", textAlign: "center", color: "var(--gray-400)", fontSize: ".85rem" }}>
              No conversations yet
            </div>
          )}
        </div>
      </div>

      {/* ── DYNAMIC AREA ── */}
      <div className={`dynamic_container${sw === "chats" ? " hided" : ""}`}>
        {sw === "Add Friend" ? (
          <Followers
            onUpdate={{
              id: authInfo?.user,
              name: authInfo?.name,
              notification: notification.length > 0 ? notification : "null",
            }}
            notification={(updated) =>
              setUserData((prev) => prev ? { ...prev, notification: updated } : prev)
            }
          />
        ) : sw === "message" ? (
          <Message
            onUpdate={(v) => setChecker((p) => ({ ...p, switched: v }))}
            id={userData}
            user={checker.messager}
            width={width}
          />
        ) : sw === "settings" ? (
          <Settings
            onUpdate={(v) => setChecker((p) => ({ ...p, switched: v }))}
            id={userData?._id || authInfo?.user}
            width={width}
            mode={checker.dark}
            modes={handleModes}
          />
        ) : (
          <DynamicContainer
            onUpdate={{ id: authInfo?.user, name: authInfo?.name }}
            messages={messagePageHandle}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
