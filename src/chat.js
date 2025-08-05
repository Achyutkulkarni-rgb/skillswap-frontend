// src/Chat.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("https://student-backend-wm44.onrender.com"); // change if different

const Chat = ({ currentUser }) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChatLog((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const data = {
        user: currentUser?.name || "Anonymous",
        text: message,
        time: new Date().toLocaleTimeString()
      };
      socket.emit("send_message", data);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Live Chat</h2>
      <div style={{ border: "1px solid #ccc", height: "200px", overflowY: "scroll", padding: "10px", marginBottom: "10px" }}>
        {chatLog.map((msg, index) => (
          <p key={index}><strong>{msg.user}</strong>: {msg.text} <small>({msg.time})</small></p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
