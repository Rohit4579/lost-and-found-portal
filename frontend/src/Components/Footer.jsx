// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

export default function Footer() {
  return (
    <footer className="dyptc-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>D.Y.P.T.C Lost & Found</h3>
          <p>Helping students recover lost belongings safely.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>D.Y.Patil Technical Campus</p>
          <p>Varale, Pune</p>
          <p>Email: support@dyptc.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <marquee>© {new Date().getFullYear()} D.Y.P.T.C Lost & Found Portal.</marquee>
      </div>
    </footer>
  );
}
