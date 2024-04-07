import React, { useEffect, useState } from "react";
import axios from "axios";
const Settings = ({ onUpdate, id, user, width, modes }) => {
  const [checker, setchecker] = useState({ dark: true });
  useEffect(() => {
    const fetch = async () => {
      let res = await axios.post("http://localhost:5000/userId", {
        id: id,
      });
      setchecker({ result: res.data });
    };
    fetch();
  }, []);
  function hadlemodes() {
    setchecker((pre) => ({ ...pre, dark: !checker.dark }));
    modes();
  }
  return (
    <>
      <div className="setting_profile">
        <div
          id="back_icon_container"
          style={{ display: width > 780 ? "none" : "flex" }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/6529/6529018.png"
            alt="back"
            className="Back_icon"
            onClick={() => onUpdate("chats")}
          />
        </div>
        <div
          id="User_Details"
          className="messagers_message"
          style={{ border: "none" }}
        >
          <div id="User_Logo">
            <h1>{checker?.result?.name[0]}</h1>
          </div>
          <div id="USER_NAME">
            <h1>
              {checker?.result?.name?.length > 25
                ? checker?.result?.name.slice(0, 25) + ".."
                : checker?.result?.name}
            </h1>
            <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              {checker?.result?.Des}
            </p>
          </div>
        </div>
      </div>
      <div
        id="dark_Light_mode"
        style={{ width: "95%" }}
        onClick={() => hadlemodes()}
      >
        <img
          src={
            !checker.dark
              ? "https://cdn-icons-png.flaticon.com/128/66/66275.png"
              : "https://cdn-icons-png.flaticon.com/128/4584/4584492.png"
          }
          alt="sun"
        />
        <h1>{checker.dark ? "Dark mode" : "Light mode"}</h1>
      </div>
    </>
  );
};

export default Settings;
