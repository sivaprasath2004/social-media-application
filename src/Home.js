import React, { useState, useEffect } from "react";
import "./Home.css";
import DynamicContainer from "./DynamicContainer";
import Cookies from "universal-cookie";
import io from "socket.io-client";
import axios from "axios";
import Followers from "./followers";
import { useNavigate } from "react-router-dom";
import Message from "./Message";
const Home = () => {
  const cookies = new Cookies();
  let user = cookies.get("user_login_advantages");
  let name = cookies.get("user_name_advantages");
  let Des = cookies.get("user_Description") || "Add";
  let socket = io("http://localhost:5000");
  const navigation = useNavigate();
  const [checker, setChecker] = useState({
    dark: true,
    switched: "none",
    name: name,
    Des: Des,
    id: user,
  });
  async function fetch(user) {
    let res = await axios.post("http://localhost:5000/userId", {
      id: user,
    });
    const rooms = res.data.RoomId.map((item) => item.id);
    let users = await axios.post("http://localhost:5000/messagers", {
      ids: rooms,
    });
    console.log(users);
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
  }, []);

  socket.on("follower", (msg) => {
    if (msg) {
      fetch(msg.me);
    }
  });
  return (
    <div id="home_page">
      <div id="profile_container">
        <h1>{checker?.name[0]}</h1>
        <div id="User_settings">
          <div>
            <img
              style={{
                filter:
                  checker.switched === "friends"
                    ? "brightness(0) saturate(100%) invert(84%) sepia(73%) saturate(1725%) hue-rotate(108deg) brightness(106%) contrast(105%)"
                    : "",
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
                : ""
            }
          >
            <img
              style={{
                filter:
                  checker?.switched === "Add Friend"
                    ? " brightness(0) saturate(100%) invert(84%) sepia(73%) saturate(1725%) hue-rotate(108deg) brightness(106%) contrast(105%)"
                    : "",
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
            onClick={() => {
              document.body.classList.toggle("dark");
              setChecker((pre) => ({ ...pre, dark: !checker.dark }));
            }}
          />
        </div>
      </div>
      <div id="FriendList_container">
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
              onChange={(e) =>
                setChecker((pre) => ({ ...pre, search: e.target.value }))
              }
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
        <div
          style={{
            width: "100%",
            height: "100%",
            overflowX: "hidden",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
            paddingTop: 10,
            paddingLeft: 5,
          }}
          id="messagers_container"
        >
          {checker?.messagers?.map((item, index) => (
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
                  {item?.name.length > 25
                    ? item.name.slice(0, 25) + ".."
                    : item.name}
                </h1>
                <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {item.Des}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div id="dynamic_container">
        {checker?.switched === "Add Friend" ? (
          <Followers
            onUpdate={{
              id: checker.id,
              name: checker.name,
              notification:
                checker?.notification?.length > 0
                  ? checker.notification
                  : "null",
            }}
          />
        ) : checker?.switched === "message" ? (
          <Message
            onUpdate={handleMessage}
            id={checker?.me}
            user={checker?.messager}
          />
        ) : (
          <DynamicContainer onUpdate={{ id: checker.id, name: checker.name }} />
        )}
      </div>
    </div>
  );
};

export default Home;
