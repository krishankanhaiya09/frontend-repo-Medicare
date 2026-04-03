import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: "80px",
        padding: "50px 20px",
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb"
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "30px"
        }}
      >
        {/* Brand */}
        <div>
          <h2 style={{ color: "#111827", marginBottom: "10px" }}>
            MediTrack
          </h2>
          <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
            Smart medication tracking system to help patients stay consistent
            with their treatment.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 style={heading}>Quick Links</h4>
          <Link to="/" style={link}>Home</Link>
          <Link to="/dashboard" style={link}>Dashboard</Link>
          <Link to="/medicines" style={link}>Medicines</Link>
          <Link to="/reports" style={link}>Reports</Link>
        </div>

        {/* Contact */}
        <div>
          <h4 style={heading}>Contact</h4>
          <p style={text}>support@meditrack.com</p>
          <p style={text}>+91 9876543210</p>
          <p style={text}>India</p>
        </div>

        {/* Social */}
        <div>
          <h4 style={heading}>Social</h4>
          <a href="#" style={link}>Instagram</a>
          <a href="#" style={link}>LinkedIn</a>
          <a href="#" style={link}>GitHub</a>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          paddingTop: "15px",
          borderTop: "1px solid #e5e7eb",
          color: "#6b7280",
          fontSize: "14px"
        }}
      >
        © 2026 MediTrack. All rights reserved.
      </div>
    </footer>
  );
};

const heading = {
  marginBottom: "10px",
  color: "#111827",
  fontWeight: "600"
};

const link = {
  display: "block",
  marginBottom: "6px",
  color: "#6b7280",
  textDecoration: "none"
};

const text = {
  marginBottom: "6px",
  color: "#6b7280"
};

export default Footer;