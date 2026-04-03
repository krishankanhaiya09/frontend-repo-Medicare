import React, { useState } from "react";
import API from "../api";

const AIChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I’m MediTrack AI. Ask me general medicine or health-related questions.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await API.post("/chat", { message });

      const botMessage = {
        role: "assistant",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
      setMessage("");
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, AI assistant is not available right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div
        className="glass-card"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "24px",
          borderRadius: "24px",
        }}
      >
        <h1 className="section-title" style={{ marginBottom: "10px" }}>
          MediTrack AI Assistant
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          Ask general health or medicine-related questions.
        </p>

        <div
          style={{
            height: "450px",
            overflowY: "auto",
            border: "1px solid rgba(239,68,68,0.12)",
            borderRadius: "20px",
            padding: "16px",
            background: "rgba(255,255,255,0.55)",
            marginBottom: "16px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "12px 16px",
                  borderRadius: "16px",
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, #ef4444, #f87171)"
                      : "rgba(255,255,255,0.88)",
                  color: msg.role === "user" ? "#fff" : "#374151",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ color: "#991b1b", padding: "8px 0" }}>
              MediTrack AI is typing...
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Ask about medicines, side effects, precautions..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            style={{
              flex: 1,
              minWidth: "240px",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "1px solid rgba(239,68,68,0.15)",
              outline: "none",
              fontSize: "15px",
            }}
          />

          <button className="glow-btn" onClick={handleSend} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;