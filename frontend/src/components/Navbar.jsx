// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../index.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [adminLogged, setAdminLogged] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  /* 🔐 Admin check */
  useEffect(() => {
    const checkAdmin = () => {
      setAdminLogged(localStorage.getItem("admin") === "true");
    };

    checkAdmin();
    window.addEventListener("storage", checkAdmin);
    return () => window.removeEventListener("storage", checkAdmin);
  }, []);

  /* 👤 Firebase auth */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  /* 📱 LOCK BODY SCROLL */
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  /* 🚨 Guard report */
  const handleReportClick = () => {
    if (!user) {
      alert("You must login first!");
      navigate("/login");
      return;
    }
    navigate("/add");
    setMenuOpen(false);
  };

  /* 👤 User logout */
  const logoutUser = async () => {
    await signOut(auth);
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  /* 🔐 Admin logout */
  const logoutAdmin = () => {
    localStorage.removeItem("admin");
    setAdminLogged(false);
    setMenuOpen(false);
    navigate("/admin-login");
  };

  if (authLoading) return null;

  return (
    <nav className="dyptc-navbar">
      <div className="navbar-logo">D.Y.P.T.C Lost & Found Portal</div>

      {/* DESKTOP NAV */}
      <ul className="navbar-list desktop-only">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><button onClick={handleReportClick}>Report</button></li>

        {adminLogged && (
          <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
        )}
      </ul>

      {/* DESKTOP ACTIONS */}
      <div className="nav-right desktop-only">
        {!adminLogged ? (
          <Link to="/admin-login">Admin</Link>
        ) : (
          <button className="logout" onClick={logoutAdmin}>Admin Logout</button>
        )}

        {user ? (
          <button className="logout" onClick={logoutUser}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      {/* 🍔 HAMBURGER */}
      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* OVERLAY */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* 📱 MOBILE MENU */}
      <aside className={`mobile-menu ${menuOpen ? "show" : ""}`}>
        <ul>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><button onClick={handleReportClick}>Report</button></li>

          {adminLogged && (
            <li>
              <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)}>
                Admin Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className="mobile-actions">
          {!adminLogged ? (
            <Link to="/admin-login" onClick={() => setMenuOpen(false)}>Admin</Link>
          ) : (
            <button className="logout" onClick={logoutAdmin}>Admin Logout</button>
          )}

          {user ? (
            <button className="logout" onClick={logoutUser}>Logout</button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      </aside>
    </nav>
  );
}
