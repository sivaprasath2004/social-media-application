import React, { useEffect, useState } from "react";
import axios from "axios";

const Settings = ({ onUpdate, id, user, width, modes, mode }) => {
  const [checker, setChecker] = useState({ dark: mode });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.post(
        "https://social-media-application-backend.onrender.com/userId",
        { id }
      );
      setChecker((p) => ({ ...p, result: res.data }));
    };
    fetchUser();
  }, []);

  function handleModes() {
    setChecker((p) => ({ ...p, dark: !checker.dark }));
    modes();
  }

  const name = checker?.result?.name || "";
  const des  = checker?.result?.Des  || "";

  return (
    <>
      {/* Profile row */}
      <div className="setting_profile">
        {width <= 780 && (
          <div id="back_icon_container">
            <img
              src="https://cdn-icons-png.flaticon.com/128/6529/6529018.png"
              alt="back"
              className="Back_icon"
              onClick={() => onUpdate("chats")}
            />
          </div>
        )}
        <div id="User_Details" className="messagers_message" style={{ border: "none" }}>
          <div id="User_Logo">
            <h1>{name[0]}</h1>
          </div>
          <div id="USER_NAME">
            <h1>{name.length > 24 ? name.slice(0, 24) + "…" : name}</h1>
            <p style={{ fontSize: ".85rem", fontWeight: 500, color: "var(--gray-500)" }}>
              {des}
            </p>
          </div>
        </div>
      </div>

      {/* Divider label */}
      <p style={{
        padding: ".875rem 1.25rem .25rem",
        fontSize: ".7rem",
        fontWeight: 700,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        color: "var(--gray-400)",
      }}>
        Preferences
      </p>

      {/* Dark/Light toggle */}
      <div
        id="dark_Light_mode"
        style={{ width: "calc(100% - 1.5rem)", margin: "0 .75rem" }}
        onClick={handleModes}
      >
        <img
          src={
            !checker.dark
              ? "https://cdn-icons-png.flaticon.com/128/66/66275.png"
              : "https://cdn-icons-png.flaticon.com/128/4584/4584492.png"
          }
          alt="theme toggle"
        />
        <h1>{checker.dark ? "Dark Mode" : "Light Mode"}</h1>
        {/* toggle pill */}
        <div style={{
          marginLeft: "auto",
          width: 38, height: 22,
          borderRadius: 11,
          background: checker.dark ? "var(--black)" : "var(--gray-200)",
          position: "relative",
          transition: "background .2s",
          flexShrink: 0,
        }}>
          <div style={{
            position: "absolute",
            top: 3,
            left: checker.dark ? 19 : 3,
            width: 16, height: 16,
            borderRadius: "50%",
            background: "var(--white)",
            transition: "left .2s",
          }} />
        </div>
      </div>
    </>
  );
};

export default Settings;
