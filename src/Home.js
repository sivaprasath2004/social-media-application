import React, { useState, useEffect } from "react";
import "./Home.css";
import "./App.css";
import DynamicContainer from "./DynamicContainer";
import Cookies from "universal-cookie";
import io from "socket.io-client";
import axios from "axios";
import Followers from "./followers";
import { useNavigate } from "react-router-dom";
import Message from "./Message";
import Settings from "./Settings";
const Home = () => {
  const socket = io("http://localhost:5000");
  const cookies = new Cookies();
  let user = cookies.get("user_login_advantages");
  let name = cookies.get("user_name_advantages");
  let Des = cookies.get("user_Description") || "Add";
  const navigation = useNavigate();
  const [checker, setChecker] = useState({
    dark: true,
    switched: "chats",
    name: name,
    Des: Des,
    id: user,
    results: "none",
  });
  const [width, setwidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => setwidth(window.innerWidth));
  }, []);
  console.log(width);
  async function fetch(user) {
    let res = await axios.post("http://localhost:5000/userId", {
      id: user,
    });
    const rooms = res.data.RoomId.map((item) => item.id);
    let users = await axios.post("http://localhost:5000/messagers", {
      ids: rooms,
    });
    setChecker((pre) => ({
      ...pre,
      notification: res.data.notification,
      user_s: rooms,
      roomid: res.data.RoomId,
      messagers: users.data,
      me: res.data,
    }));
  }
  function handleMessage(item) {
    setChecker((pre) => ({ ...pre, switched: item }));
  }
  useEffect(() => {
    socket.emit("join", { me: checker.id, name: checker.name }, (err) => {
      console.log(err);
    });
    if (!user && !name) {
      navigation("/login");
    } else {
      fetch(user);
      console.log("how may");
    }
  }, [user, name]);
  const refetching = () => {
    fetch(user);
  };
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
  function searchEngine(item, index) {
    return (
      <div
        key={`User_Details_${index}`}
        id="User_Details"
        onClick={() =>
          setChecker((pre) => ({
            ...pre,
            messager: item,
            switched: "message",
          }))
        }
        className="messagers_message"
      >
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
            onClick={() => setChecker((pre) => ({ ...pre, menuBar: "open" }))}
          ></div>
        </div>
        <div id="menu_tabs">
          <p
            className={checker.switched === "chats" ? "active" : ""}
            onClick={() => setChecker((pre) => ({ ...pre, switched: "chats" }))}
          >
            Message
          </p>
          <p
            className={checker.switched === "Add Friend" ? "active" : ""}
            onClick={() =>
              setChecker((pre) => ({ ...pre, switched: "Add Friend" }))
            }
          >
            Followings
          </p>
          <p
            className={checker.switched === "search" ? "active" : ""}
            onClick={() =>
              setChecker((pre) => ({ ...pre, switched: "search" }))
            }
          >
            Find
          </p>
        </div>
      </div>
      <div id="profile_container">
        <h1>{checker?.name[0]}</h1>
        <div id="User_settings">
          <div>
            <img
              style={{
                filter:
                  checker.switched === "friends"
                    ? "brightness(0) saturate(100%) invert(84%) sepia(73%) saturate(1725%) hue-rotate(108deg) brightness(106%) contrast(105%)"
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
                    ? " brightness(0) saturate(100%) invert(84%) sepia(73%) saturate(1725%) hue-rotate(108deg) brightness(106%) contrast(105%)"
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
                    ? " brightness(0) saturate(100%) invert(84%) sepia(73%) saturate(1725%) hue-rotate(108deg) brightness(106%) contrast(105%)"
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
            <h1>{checker?.name[0]}</h1>
          </div>
          <div id="my_name">
            <h1>
              {checker?.name.length > 20
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
        <div id="border_line"></div>
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
              setChecker((pre) => ({ ...pre, switched: "message" }))
            }
          />
        </div>
        <div id="border_line"></div>
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
            notification={refetching}
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
            onUpdate={{ id: checker.id, name: checker.name }}
            messages={messagePageHandle}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
