import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./followers.css";

// Shared socket — not recreated on render
const socket = io("https://social-media-application-backend.onrender.com", { autoConnect: true });

const Followers = ({ onUpdate, notification }) => {
  const Id   = onUpdate.id;
  const name = onUpdate.name;

  const [followings, setFollowings] = useState([]);
  const [followers,  setFollowers]  = useState([]);
  const [notify,     setNotify]     = useState(onUpdate.notification);
  const [checker,    setChecker]    = useState({
    Alert: false, user: null, letter: null,
    navigate: true,
    followers_check: true, following_check: true,
  });

  const fetchData = useCallback(async () => {
    const res = await axios.post("https://social-media-application-backend.onrender.com/followings", {
      id: Id, section: "follow",
    });
    setFollowings(typeof res.data.followings === "string" ? [] : res.data.followings);
    setFollowers( typeof res.data.followers  === "string" ? [] : res.data.followers);
    setChecker((p) => ({
      ...p,
      followers_check: typeof res.data.followers  === "string",
      following_check: typeof res.data.followings === "string",
    }));
  }, [Id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Socket: join personal room + listen for follower events
  useEffect(() => {
    socket.emit("join", { me: Id, name });
    const handler = (msg) => { if (msg) fetchData(); };
    socket.on("follower", handler);
    return () => socket.off("follower", handler); // ✅ cleanup
  }, [Id, name, fetchData]);

  function handle_unfollow(id) {
    if (checker.letter === "Unfollow") {
      setFollowings((prev) => prev.filter((i) => i._id !== id));
    } else {
      setFollowers((prev) => prev.filter((i) => i._id !== id));
    }
    socket.emit("unfollow", { me: Id, you: id, name, text: checker.letter }, () => {});
    setChecker((p) => ({ ...p, Alert: false, user: null, letter: null }));
  }

  function unfollow(id, condition) {
    const list = condition === "following" ? followings : followers;
    const fin  = list.find((i) => i._id === id);
    setChecker((p) => ({
      ...p, Alert: true, user: fin,
      letter: condition === "following" ? "Unfollow" : "Remove",
    }));
  }

  async function removeNotification(item) {
    const updated = (notify === "null" ? [] : notify).filter((e) => e !== item);
    await axios.post("https://social-media-application-backend.onrender.com/deleteMessage", { id: Id, item });
    setNotify(updated.length ? updated : "null");
    notification(updated.length ? updated : []);
  }

  function UserRow(item, index, condition) {
    return (
      <div key={`user_row_${index}`} id="User_Profile">
        <div id="User_Details">
          <div id="User_Logo"><h1>{item?.name?.[0]}</h1></div>
          <div id="USER_NAME">
            <h1>{item?.name?.length > 22 ? item.name.slice(0, 22) + "…" : item.name}</h1>
            <p style={{ fontSize: ".78rem", color: "var(--gray-500)" }}>{item.Des}</p>
          </div>
        </div>
        <button
          id={condition === "following" ? "following_butt" : "followed_butt"}
          onClick={() => unfollow(item._id, condition)}
        >
          {condition === "following" ? "Unfollow" : "Remove"}
        </button>
      </div>
    );
  }

  const showFollowing = checker.navigate;
  const notifyList    = notify === "null" ? [] : (notify || []);

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      overflowY: checker.Alert ? "hidden" : "auto",
      overflowX: "hidden",
    }}>
      {/* Tab nav */}
      <div id="navigator">
        <h1
          id={notifyList.some((i) => i.notify === "following" || i.notify === "unfollow") ? "notification" : ""}
          className={showFollowing ? "hovered color" : "color"}
          onClick={() => setChecker((p) => ({ ...p, navigate: true }))}
        >
          {followings.length} Following
        </h1>
        <h1
          id={notifyList.some((i) => i.notify === "remove" || i.notify === "followers") ? "notification" : ""}
          className={!showFollowing ? "hovered color" : "color"}
          onClick={() => setChecker((p) => ({ ...p, navigate: false }))}
        >
          {followers.length} Followers
        </h1>
      </div>

      {/* Confirm modal */}
      {checker.Alert && (
        <div id="Alert">
          <div id="parent_tag_remove">
            <div id="User_Logo"><h1>{checker.user?.name?.[0]}</h1></div>
            <h2>{checker.user?.name}</h2>
            <h3>Are you sure you want to {checker.letter?.toLowerCase()} this person?</h3>
            <button id="remove" onClick={() => handle_unfollow(checker.user._id)}>
              {checker.letter}
            </button>
            <button id="cancel" onClick={() => setChecker((p) => ({ ...p, Alert: false }))}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {notifyList.map((item, index) => {
        const show = showFollowing
          ? item.notify !== "remove" && item.notify !== "followers"
          : item.notify === "remove" || item.notify === "followers";
        if (!show) return null;
        const isRed = item.notify === "unfollow" || item.notify === "remove";
        return (
          <div key={`notif_${index}`} id={isRed ? "Alert_red" : "Alert_Blue"}>
            <div id="notifications">
              <h1>{item.name?.length > 15 ? item.name.slice(0, 15) + "…" : item.name}</h1>
              <p>
                {item.notify === "unfollow" ? " unfollowed you"
                 : item.notify === "remove"  ? " removed you"
                 : " started following you"}
              </p>
            </div>
            <img
              id="close_image"
              src="https://cdn-icons-png.flaticon.com/128/32/32178.png"
              alt="dismiss"
              onClick={() => removeNotification(item)}
            />
          </div>
        );
      })}

      {/* Lists */}
      {showFollowing
        ? followings.length
          ? followings.map((item, i) => UserRow(item, i, "following"))
          : <h1 id="nomore_foll">No followings yet</h1>
        : followers.length
          ? followers.map((item, i) => UserRow(item, i, "follower"))
          : <h1 id="nomore_foll">No followers yet</h1>}
    </div>
  );
};

export default Followers;
