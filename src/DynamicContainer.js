import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("https://social-media-application-backend.onrender.com", { autoConnect: true });

const DynamicContainer = ({ onUpdate, messages }) => {
  const Id   = onUpdate.id;
  const name = onUpdate.name;

  const [checker,   setChecker]  = useState({ switched: "search", input: "" });
  const [following, setFollowing] = useState([]);

  const search = useCallback(async () => {
    if (!checker.input) return;
    const [res, follow] = await Promise.all([
      axios.post("https://social-media-application-backend.onrender.com/searchResult", { val: checker.input }),
      axios.post("https://social-media-application-backend.onrender.com/followings",   { id: Id, section: "no" }),
    ]);
    const alreadyFollowing = follow.data?.following || [];
    setFollowing(alreadyFollowing);
    setChecker((p) => ({ ...p, users: res.data, followers: follow.data }));
  }, [checker.input, Id]);

  useEffect(() => {
    if (checker.input?.length >= 1) search();
    if (!checker.input) setChecker((p) => ({ ...p, users: undefined }));
  }, [checker.input]);

  function handleFollow(id) {
    setFollowing((p) => [...p, id]);
    socket.emit("follow", { me: Id, you: id, name }, () => {});
  }

  async function handleMessagePage(ele) {
    const res = await axios.post("https://social-media-application-backend.onrender.com/room", {
      id: Id, user: ele._id,
    });
    messages(res.data, ele);
  }

  return (
    <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
      {/* Search bar */}
      <div id="global_search">
        <img src="https://cdn-icons-png.flaticon.com/128/2811/2811790.png" alt="search" />
        <input
          id="special"
          type="text"
          onChange={(e) => setChecker((p) => ({ ...p, input: e.target.value }))}
          placeholder="Search people…"
        />
      </div>

      {!checker?.users && (
        <div id="nomore_foll" style={{ flexDirection: "column", gap: ".5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🔍</span>
          <span>Search for people to follow</span>
        </div>
      )}

      {checker?.users?.map((item, index) => (
        <div key={`user_${index}`} id="User_Profile">
          <div id="User_Details">
            <div id="User_Logo"><h1>{item?.name?.[0]}</h1></div>
            <div id="USER_NAME">
              <h1>{item?.name?.length > 22 ? item.name.slice(0, 22) + "…" : item.name}</h1>
              <p style={{ fontSize: ".8rem", color: "var(--gray-500)" }}>{item.Des}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/12795/12795083.png"
              alt="message"
              id="message_icon"
              onClick={() => handleMessagePage(item)}
            />
            {following.includes(item._id) ? (
              <button id="following_butt">Following</button>
            ) : checker?.followers?.followers?.includes?.(item?._id) ? (
              <button id="followed_butt">Followed</button>
            ) : (
              <button className="user_Follow_Button" onClick={() => handleFollow(item._id)}>
                Follow
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicContainer;
