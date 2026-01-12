// src/components/Layout.jsx
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {

  // 🌙 Apply theme on every page load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    // Smooth transition effect
    document.body.style.transition = "background-color 0.3s, color 0.3s";
  }, []);

  return (
    <div className="layout-wrapper">
      <Navbar />

      <main className="page-content">
        {children}
      </main>

      <Footer />
    </div>
  );
}
