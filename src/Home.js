import React, { useState, useEffect } from "react";
import "./Home.css";
import "./App.css";
import DynamicContainer from "./DynamicContainer";
import io from "socket.io-client";
import axios from "axios";
import Followers from "./followers";
import { useNavigate } from "react-router-dom";
import Message from "./Message";
import Settings from "./Settings";
import Navigate from "./Navigate";
const Home = ({ name, user, Des }) => {
  const navigate = useNavigate();
  const [checker, setChecker] = useState({
    dark: true,
    switched: "chats",
    results: "none",
    id: user,
    menuBar: false,
  });
  useEffect(() => {
    let ret = Navigate();
    if (ret.red === "no-redirect") {
      navigate("/login");
    } else {
      setChecker((pre) => ({
        ...pre,
        name: ret.name,
        user: ret.user,
        Des: ret.Des,
      }));
    }
    fetch(user);
  }, []);

  const socket = io("https://social-media-application-backend.onrender.com");

  const [width, setwidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => setwidth(window.innerWidth));
  }, []);
  async function fetch(user) {
    let res = await axios.post(
      "https://social-media-application-backend.onrender.com/userId",
      {
        id: user,
      }
    );
    if (res.data?.RoomId?.length > 0) {
      const rooms = res.data?.RoomId?.map((item) => item.id);
      let users = await axios.post(
        "https://social-media-application-backend.onrender.com/messagers",
        {
          ids: rooms,
        }
      );
      console.log(res.data.notification);
      setChecker((pre) => ({
        ...pre,
        notification: res.data.notification,
        user_s: rooms,
        roomid: res.data.RoomId,
        messagers: users.data,
        me: res.data,
      }));
    } else {
      setChecker((pre) => ({
        ...pre,
        me: res.data,
      }));
    }
  }
  useEffect(() => {
    socket.emit("join", { me: checker.id, name: checker.name }, (err) => {});
  }, []);
  function handleMessage(item) {
    setChecker((pre) => ({ ...pre, switched: item }));
  }
  socket.on("follower", (msg) => {
    if (msg) {
      setTimeout(() => {
        fetch(msg.me);
      }, 1000);
    }
  });
  const handleModes = () => {
    document.body.classList.toggle("dark");
    setChecker((pre) => ({ ...pre, dark: !checker.dark }));
  };
  function searchResults(text) {
    if (checker?.messagers) {
      let any = checker.messagers.filter((user) => user.name.includes(text));
      setChecker((pre) => ({ ...pre, results: any }));
    }
    if (checker?.search?.length === 0) {
      setChecker((pre) => ({ ...pre, results: "none" }));
    }
    setChecker((pre) => ({ ...pre, search: text }));
  }
  function messagePageHandle(id, user) {
    setChecker((pre) => ({
      ...pre,
      messager: user,
      me: id,
      switched: "message",
    }));
  }
  function handleMenssgae_notificatio(ele) {
    setChecker((pre) => ({ ...pre, notification: ele }));
  }
  async function removeNotification(item) {
    let element = checker.notification.filter((ele) => ele.id !== item.id);
    console.log(element);
    setChecker((pre) => ({
      ...pre,
      messager: item,
      switched: "message",
      notification: element,
    }));
    await axios.post(
      "https://social-media-application-backend.onrender.com/deleteMessage",
      {
        id: user,
        item: item,
      }
    );
  }
  function searchEngine(item, index) {
    return (
      <div
        key={`User_Details_${index}`}
        className="Messager_s"
        id="User_Details"
        onClick={() => {
          removeNotification(item);
        }}
      >
        {checker?.notification.find((ele) => ele.id === item.id) ? (
          <div className="notification_trued">
            <div></div>
            <p className="notification_time">
              {
                checker?.notification
                  .find((ele) => ele.id === item.id)
                  .time.split("/")[0]
              }
            </p>
          </div>
        ) : (
          <></>
        )}
        <div key={`logo_${index}`} id="User_Logo">
          <h1>{item?.name[0]}</h1>
        </div>
        <div key={`name${index}`} id="USER_NAME">
          <h1>
            {item?.name?.length > 25
              ? item?.name.slice(0, 25) + ".."
              : item?.name}
          </h1>
          <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>{item?.Des}</p>
        </div>
      </div>
    );
  }
  return (
    <div id="home_page">
      <div
        className={
          checker.switched !== "message" && checker.switched !== "settings"
            ? "header"
            : "header hided"
        }
      >
        <div id="name">
          <h1>Zodia</h1>
          <div
            id="menu"
            onClick={() =>
              setChecker((pre) => ({ ...pre, menuBar: !checker.menuBar }))
            }
          ></div>
          <div
            className={checker.menuBar ? "menu_setting" : "menu_setting hiding"}
            onClick={() =>
              setChecker((pre) => ({
                ...pre,
                switched: "settings",
                menuBar: false,
              }))
            }
          >
            <h1>Settings</h1>
          </div>
        </div>
        <div id="menu_tabs">
          <div
            className={checker.switched === "chats" ? "active" : ""}
            onClick={() => setChecker((pre) => ({ ...pre, switched: "chats" }))}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/8315/8315859.png"
              alt="message_icon"
            />{" "}
            <p>Message</p>
          </div>
          <div
            className={checker.switched === "Add Friend" ? "active" : ""}
            onClick={() =>
              setChecker((pre) => ({ ...pre, switched: "Add Friend" }))
            }
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/33/33308.png"
              alt="people"
            />
            <p>Followings</p>
          </div>
          <div
            className={checker.switched === "search" ? "active" : ""}
            onClick={() =>
              setChecker((pre) => ({ ...pre, switched: "search" }))
            }
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/14247/14247188.png"
              alt="find"
            />
            <p>Find</p>
          </div>
        </div>
      </div>
      <div id="profile_container">
        <h1>{checker?.name ? checker.name[0] : "U"}</h1>
        <div id="User_settings">
          <div>
            <img
              style={{
                filter:
                  checker.switched === "friends"
                    ? "brightness(0) saturate(100%) invert(24%) sepia(45%) saturate(5956%) hue-rotate(348deg) brightness(91%) contrast(95%)"
                    : " ",
              }}
              src="https://cdn-icons-png.flaticon.com/128/9055/9055030.png"
              alt="friends"
              onClick={() =>
                setChecker((pre) => ({ ...pre, switched: "friends" }))
              }
            />
          </div>
          <div
            className={
              checker?.notification?.some((item) => item.notify !== "message")
                ? "notification"
                : " "
            }
          >
            <img
              style={{
                filter:
                  checker?.switched === "Add Friend"
                    ? " brightness(0) saturate(100%) invert(24%) sepia(45%) saturate(5956%) hue-rotate(348deg) brightness(91%) contrast(95%)"
                    : " ",
              }}
              src="https://cdn-icons-png.flaticon.com/128/880/880594.png"
              alt="Add Friend"
              onClick={() =>
                setChecker((pre) => ({ ...pre, switched: "Add Friend" }))
              }
            />
          </div>
          <div>
            <img
              style={{
                filter:
                  checker?.switched === "settings"
                    ? " brightness(0) saturate(100%) invert(24%) sepia(45%) saturate(5956%) hue-rotate(348deg) brightness(91%) contrast(95%)"
                    : "",
              }}
              src="https://cdn-icons-png.flaticon.com/128/15360/15360026.png"
              alt="settings"
              onClick={() =>
                setChecker((pre) => ({ ...pre, switched: "settings" }))
              }
            />
          </div>
        </div>
        <div id="dark_Light_mode">
          <img
            src={
              checker.dark
                ? "https://cdn-icons-png.flaticon.com/128/66/66275.png"
                : "https://cdn-icons-png.flaticon.com/128/4584/4584492.png"
            }
            alt="sun"
            onClick={() => handleModes()}
          />
        </div>
      </div>
      <div
        className={
          checker.switched === "chats"
            ? "FriendList_container"
            : "FriendList_container hided"
        }
      >
        <div id="my_profile">
          <div id="logo">
            <h1>{checker?.name?.[0]}</h1>
          </div>
          <div id="my_name">
            <h1>
              {checker?.name?.length > 20
                ? checker.name.slice(0, 20) + ".."
                : checker.name}
            </h1>
            <h2>
              {checker?.Des?.length > 20
                ? checker.Des.slice(0, 20) + ".."
                : checker.Des}
            </h2>
          </div>
        </div>
        <div className="border_line first_line"></div>
        <div id="user_search">
          <div id="search">
            <input
              id="special"
              type="text"
              onChange={(e) => searchResults(e.target.value)}
              placeholder="search"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/128/2811/2811790.png"
              alt="search"
            />
          </div>
          <img
            id="add_icon"
            src="https://cdn-icons-png.flaticon.com/128/9312/9312231.png"
            alt="add"
            onClick={() =>
              setChecker((pre) => ({ ...pre, switched: "search" }))
            }
          />
        </div>
        <div className="border_line"></div>
        <div id="messagers_container">
          {checker.results === "none"
            ? checker?.messagers?.map((item, index) =>
                searchEngine(item, index)
              )
            : checker.results.map((item, index) => searchEngine(item, index))}
        </div>
      </div>
      {checker?.switched === "Add Friend" ? (
        <div
          className={
            checker?.switched === "Add Friend"
              ? "dynamic_container"
              : "dynamic_container hided"
          }
        >
          <Followers
            onUpdate={{
              id: checker.id,
              name: checker.name,
              notification:
                checker?.notification?.length > 0
                  ? checker.notification
                  : "null",
            }}
            notification={handleMenssgae_notificatio}
          />
        </div>
      ) : checker?.switched === "message" ? (
        <div
          className={
            checker?.switched === "message"
              ? "dynamic_container"
              : "dynamic_container hided"
          }
        >
          <Message
            onUpdate={handleMessage}
            id={checker?.me}
            user={checker?.messager}
            width={width}
          />
        </div>
      ) : checker.switched === "settings" ? (
        <div
          className={
            checker?.switched === "settings"
              ? "dynamic_container"
              : "dynamic_container hided"
          }
        >
          <Settings
            onUpdate={handleMessage}
            id={checker?.me}
            user={checker?.messager}
            width={width}
            mode={checker.dark}
            modes={handleModes}
          />
        </div>
      ) : (
        <div
          className={
            checker?.switched === "search"
              ? "dynamic_container"
              : "dynamic_container hided"
          }
        >
          <DynamicContainer
            onUpdate={{ id: user, name: checker.name }}
            messages={messagePageHandle}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
