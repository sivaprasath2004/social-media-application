import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
const DynamicContainer = ({ onUpdate, messages }) => {
  const socket = io("https://social-media-application-backend.onrender.com");
  let Id = onUpdate.id;
  let name = onUpdate.name;
  const [checker, setChecker] = useState({ switched: "search", user: "null" });
  const [Following, setFollowing] = useState([]);
  const search = async () => {
    let res = await axios.post(
      "https://social-media-application-backend.onrender.com/searchResult",
      {
        val: checker.input,
      }
    );
    let follow = await axios.post(
      "https://social-media-application-backend.onrender.com/followings",
      {
        id: Id,
        section: "no",
      }
    );
    setChecker((pre) => ({
      ...pre,
      users: res.data,
      followers: follow.data,
    }));
    follow.data?.following?.map((item) =>
      setFollowing((pre) => [...pre, item])
    );
  };
  useEffect(() => {
    if (checker.input?.length === 1) {
      search();
    }
  }, [checker.input]);
  function handleFollow(id, index) {
    setFollowing((pre) => [...pre, id]);
    socket.emit("follow", { me: Id, you: id, name }, (err) => {
      if (err) {
      }
    });
  }
  async function handleMessagePage(ele) {
    let res = await axios.post(
      "https://social-media-application-backend.onrender.com/room",
      {
        id: Id,
        user: ele._id,
      }
    );
    messages(res.data, ele);
  }
  function searchResults(text) {
    setChecker((pre) => ({ ...pre, input: text }));
    if (checker?.users) {
      let any = checker.users.filter((user) => user.name.includes(text));
      setChecker((pre) => ({ ...pre, users: any }));
    }
  }
  return (
    <>
      <div style={{ width: "100%", height: "100%", overflowY: "scroll" }}>
        <div id="global_search">
          <img
            src="https://cdn-icons-png.flaticon.com/128/2811/2811790.png"
            alt="search"
          />
          <input
            id="special"
            type="text"
            onChange={(e) => searchResults(e.target.value)}
            placeholder="search"
          />
        </div>
        {checker?.users?.map((item, index) => (
          <div key={`parent_tag${index}`} id="User_Profile">
            <div key={`User_Details_${index}`} id="User_Details">
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/12795/12795083.png"
                alt="message"
                id="message_icon"
                onClick={() => handleMessagePage(item)}
              />
              {Object.values(Following).includes(item._id) ? (
                <button
                  key={`user_Following_Button${index}`}
                  id="following_butt"
                >
                  Following
                </button>
              ) : checker?.followers?.followers?.includes?.(item?._id) ? (
                <button key={`user_Follow_Button${index}`} id="followed_butt">
                  Followed
                </button>
              ) : (
                <button
                  key={`user_Follow_Button${index}`}
                  className="user_Follow_Button"
                  id={`user_follow_butt${index}`}
                  onClick={() => handleFollow(item._id, index)}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DynamicContainer;
