import React from "react";

const Message = ({ onUpdate }) => {
  function handleBack() {
    onUpdate("search");
  }
  return (
    <div id="message_page">
      <h1>Message</h1>
      <img
        src="https://cdn-icons-png.flaticon.com/128/6529/6529018.png"
        alt="back"
        id="Back_icon"
        onClick={handleBack}
      />
    </div>
  );
};

export default Message;
