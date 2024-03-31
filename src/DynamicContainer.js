import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Message from "./Message";
const DynamicContainer = ({ onUpdate }) => {
  let socket;
  let Id = onUpdate.id;
  let name = onUpdate.name;
  console.log(onUpdate.id);
  const [checker, setChecker] = useState({ switched: "search", user: "null" });
  const [Following, setFollowing] = useState([]);
  const search = async () => {
    if (checker?.input?.length === 1) {
      let res = await axios.post("http://localhost:5000/searchResult", {
        val: checker.input,
      });
      let follow = await axios.post("http://localhost:5000/followings", {
        id: Id,
        section: "no",
      });
      setChecker((pre) => ({
        ...pre,
        users: res.data,
        followers: follow.data,
      }));
      follow.data.following.map((item) =>
        setFollowing((pre) => [...pre, item])
      );
    } else {
      console.log("no more");
      console.log(checker?.input);
    }
  };
  if (checker?.input?.length === 1) {
    search();
  }
  function handleFollow(id, index) {
    setFollowing((pre) => [...pre, id]);
    socket = io("http://localhost:5000");
    socket.emit("follow", { me: Id, you: id, name }, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  function handleMessage(item) {
    setChecker((pre) => ({ ...pre, switched: item }));
  }
  async function handleMessagePage(ele) {
    setChecker((pre) => ({ ...pre, user: ele }));
    const roomId_creates = async () => {
      let res = await axios.post("http://localhost:5000/room", {
        id: Id,
        user: ele._id,
      });
      setChecker((pre) => ({
        ...pre,
        switched: "message",
        verified: res.data,
      }));
    };
    roomId_creates();
  }
  return (
    <>
      {checker.switched !== "message" ? (
        <div style={{ width: "100%", height: "100%", overflowY: "scroll" }}>
          <div id="global_search">
            <img
              src="https://cdn-icons-png.flaticon.com/128/2811/2811790.png"
              alt="search"
            />
            <input
              id="special"
              type="text"
              onChange={(e) =>
                setChecker((pre) => ({ ...pre, input: e.target.value }))
              }
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
                ) : checker.followers.followers.includes(item._id) ? (
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
      ) : (
        <Message
          onUpdate={handleMessage}
          id={checker.verified}
          user={checker?.user}
        />
      )}
    </>
  );
};

export default DynamicContainer;
