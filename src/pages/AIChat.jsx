import React, { useState } from "react";

const AIChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I’m MediTrack Assistant. Ask me basic health-related questions.",
    },
  ]);

  const getDummyReply = (text) => {
    const msg = text.toLowerCase();

    if (msg.includes("fever")) {
      return "For fever, stay hydrated, rest well, and monitor your temperature. Please consult a doctor if it gets worse.";
    }
    if (msg.includes("headache")) {
      return "For headache, drink water, take proper rest, and avoid too much screen time. If severe, consult a doctor.";
    }
    if (msg.includes("cold") || msg.includes("cough")) {
      return "For cold or cough, take rest, drink warm fluids, and consult a doctor if symptoms continue.";
    }
    if (msg.includes("medicine")) {
      return "Please take your medicine on time and follow the prescription given by your doctor.";
    }

    return "I’m a demo assistant right now. For medical emergencies or exact advice, please consult a doctor.";
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", text: message };
    const botReply = {
      role: "assistant",
      text: getDummyReply(message),
    };

    setMessages((prev) => [...prev, userMessage, botReply]);
    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>MediTrack Assistant</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "15px",
          height: "350px",
          overflowY: "auto",
          marginBottom: "15px",
          background: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: "12px",
                background: msg.role === "user" ? "#3b82f6" : "#e5e7eb",
                color: msg.role === "user" ? "#fff" : "#111",
                maxWidth: "75%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;