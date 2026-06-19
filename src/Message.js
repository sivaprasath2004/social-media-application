import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Message.css";
import { io } from "socket.io-client";
import axios from "axios";

// Single socket instance outside component — no new socket on every render
const socket = io("https://social-media-application-backend.onrender.com", { autoConnect: true });

const Message = ({ onUpdate, id, user, width }) => {
  const [messages, setMessages]   = useState([]);
  const [input,    setInput]      = useState("");
  const containerRef              = useRef(null);
  const roomid                    = id?.RoomId?.find((item) => item.id === user?._id);

  // Join room once
  useEffect(() => {
    if (!roomid?.roomId) return;
    socket.emit("room", { id: roomid.roomId }, () => {});
  }, [roomid?.roomId]);

  // Listen for incoming messages
  useEffect(() => {
    const handler = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("Messages", handler);
    return () => socket.off("Messages", handler); // ✅ cleanup on unmount
  }, []);

  // Fetch chat history
  useEffect(() => {
    if (!roomid?.roomId) return;
    const fetchChats = async () => {
      const res = await axios.post("https://social-media-application-backend.onrender.com/chattings", {
        id: roomid.roomId,
      });
      if (res.data?.chats?.length) setMessages(res.data.chats);
    };
    fetchChats();
  }, [roomid?.roomId]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (containerRef.current)
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    socket.emit(
      "message",
      {
        id:     id._id,
        user:   user._id,
        roomid: roomid.roomId,
        name:   id.name,
        text:   input,
      },
      () => {}
    );
    setInput("");
  }, [input, id, user, roomid]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!roomid) {
    return (
      <div id="message_page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--gray-400)" }}>Room not found. Try again.</p>
      </div>
    );
  }

  return (
    <div id="message_page">
      {/* Header */}
      <div id="message_header_container">
        <div id="profile_back_container">
          <img
            src="https://cdn-icons-png.flaticon.com/128/6529/6529018.png"
            alt="back"
            id="Back_icon"
            onClick={() => onUpdate(width > 781 ? "search" : "chats")}
          />
          <div id="User_Details">
            <div id="User_Logo">
              <h1>{user?.name?.[0]}</h1>
            </div>
            <div id="USER_NAME">
              <h1>{user?.name?.length > 22 ? user.name.slice(0, 22) + "…" : user?.name}</h1>
              <p>{user?.Des}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat bubbles */}
      <div ref={containerRef} id="chattings">
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--gray-400)", fontSize: ".85rem", paddingTop: "2rem" }}>
            Say hello 👋
          </div>
        )}
        {messages.map((item, index) => {
          const isMe = id._id === item.id;
          return (
            <div key={`msg_${index}`} id={isMe ? "me" : "you"}>
              <div id="user_chat" className={isMe ? "me" : "you"}>
                <h1>{item.text}</h1>
              </div>
              <p id="clock" className={isMe ? "right" : "left"}>
                {item.time?.split("/")?.[0]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="input_container">
        <textarea
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          style={{
            height: input.length > 114 ? "80px" : input.length > 40 ? "56px" : "40px",
          }}
        />
        <div id="send_Icon" onClick={sendMessage}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/10747/10747272.png"
            alt="send"
          />
        </div>
      </div>
    </div>
  );
};

export default Message;
