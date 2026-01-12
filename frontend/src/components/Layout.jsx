// src/components/Layout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const location = useLocation();

  // Apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    document.body.classList.toggle("dark", savedTheme === "dark");
    document.body.style.transition = "background-color 0.3s, color 0.3s";
  }, []);

  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="page-content">
        <Outlet /> {/* This renders nested pages like Home, About, AddItem */}
      </main>
      <Footer />
    </div>
  );
}
