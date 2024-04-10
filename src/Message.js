import React, { useState, useEffect, useRef } from "react";
import "./Message.css";
import io from "socket.io-client";
import axios from "axios";
let count = 1;
const Message = ({ onUpdate, id, user, width }) => {
  const socket = io(
    "https://social-media-application-backend-woad.vercel.app",
    {
      transports: ["websocket", "polling"],
    }
  );
  const [checker, setChecker] = useState({});
  const [messages, setMessages] = useState([]);
  const containerRef = useRef(null);
  function handleBack() {
    if (width > 781) {
      onUpdate("search");
    } else {
      onUpdate("chats");
    }
  }
  const roomid = id.RoomId.find((item) => item.id === user._id);
  useEffect(() => {
    socket.emit("room", { id: roomid.roomId }, (err) => {
      console.log(err);
    });
  }, []);
  socket.on("Messgaes", (msg) => {
    setMessages((pre) => [...pre, msg]);
  });

  useEffect(() => {
    const fetch = async () => {
      let res = await axios.post(
        "https://social-media-application-backend-woad.vercel.app/chattings",
        {
          id: roomid.roomId,
        }
      );
      if (res.data.chats !== undefined) {
        setMessages(res.data.chats);
        count += 1;
      }
    };
    fetch();
  }, []);
  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);
  function sendMessage() {
    socket.emit(
      "message",
      {
        id: id._id,
        user: user,
        roomid: roomid.roomId,
        name: id.name,
        text: checker.input,
      },
      (msg) => console.log(msg)
    );
    setChecker((pre) => ({ ...pre, input: "" }));
  }
  return (
    <div id="message_page">
      <div id="message_header_container">
        <div id="profile_back_container">
          <img
            src="https://cdn-icons-png.flaticon.com/128/6529/6529018.png"
            alt="back"
            id="Back_icon"
            onClick={handleBack}
          />
          <div id="User_Details">
            <div id="User_Logo">
              <h1>{user?.name[0]}</h1>
            </div>
            <div id="USER_NAME">
              <h1>
                {user?.name.length > 25
                  ? user.name.slice(0, 25) + ".."
                  : user.name}
              </h1>
              <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>{user.Des}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        id="chattings"
        style={{ height: "80%", overflow: "scroll", width: "100%" }}
      >
        {messages.map((item, index) => (
          <div
            key={`chatting_checkek_container${index}`}
            id={id._id === item.id ? "me" : "you"}
          >
            <div
              key={`user_chats${index}`}
              id="user_chat"
              className={id._id === item.id ? "me" : "you"}
            >
              <h1 key={`user_chat_text${index}`}>{item.text} </h1>
            </div>
            <p
              id="clock"
              className={id._id === item.id ? "right" : "left"}
              key={`time${index}`}
            >
              {item.time.split("/")[0]}
            </p>
          </div>
        ))}
      </div>
      <div className="input_container">
        <textarea
          style={{
            height:
              checker?.input?.length > 114
                ? "70px"
                : checker?.input?.length > 37
                ? "52px"
                : "20px",
            overflow: checker?.input?.length > 37 ? "auto" : "hidden",
          }}
          type="text"
          placeholder="Message"
          value={checker?.input}
          onChange={(e) =>
            setChecker((pre) => ({ ...pre, input: e.target.value }))
          }
        />
        <div id="send_Icon">
          <img
            src="https://cdn-icons-png.flaticon.com/128/10747/10747272.png"
            style={{ height: 30, width: 30 }}
            alt="send"
            onClick={() => sendMessage()}
          />
        </div>
      </div>
    </div>
  );
};

export default Message;
