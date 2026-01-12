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

  // 🔐 Admin listener
  useEffect(() => {
    const checkAdmin = () => {
      const isAdmin = localStorage.getItem("admin") === "true";
      setAdminLogged(isAdmin);

      if (!isAdmin && window.location.pathname === "/admin-dashboard") {
        navigate("/admin-login", { replace: true });
      }
    };

    checkAdmin();
    window.addEventListener("storage", checkAdmin);
    return () => window.removeEventListener("storage", checkAdmin);
  }, [navigate]);

  // 👤 Firebase auth listener (FINAL FIX)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      const isSigningUp = localStorage.getItem("isSigningUp") === "true";

      if (isSigningUp) {
        // 🚫 Ignore auto-login during signup
        setUser(null);

        // ✅ Wait until Firebase confirms logout
        if (!currentUser) {
          setAuthLoading(false);
        }
        return;
      }

      setUser(currentUser);
      setAuthLoading(false);
    });

    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }

    return unsub;
  }, []);

  const handleReportClick = () => {
    if (!user) {
      alert("You must login first!");
      navigate("/login");
      return;
    }
    navigate("/add");
  };

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  };

  const logoutUser = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/");
  };

  const logoutAdmin = () => {
    localStorage.removeItem("admin");
    setAdminLogged(false);
    navigate("/admin-login");
  };

  // ⛔ Block render until auth is truly stable
  if (authLoading) return null;

  return (
    <nav className="dyptc-navbar">
      <div className="navbar-logo">D.Y.P.T.C Lost & Found Portal</div>

      <ul className="navbar-list">
        <li><Link className="navbar-link" to="/">Home</Link></li>
        <li><Link className="navbar-link" to="/about">About</Link></li>
        <li>
          <button
            className="navbar-link navbar-report-btn"
            onClick={handleReportClick}
          >
            Report
          </button>
        </li>

        {adminLogged && (
          <li>
            <Link className="navbar-link" to="/admin-dashboard">
              Admin Dashboard
            </Link>
          </li>
        )}
      </ul>

      <div className="nav-right">
        <button className="theme-toggle" onClick={toggleTheme}>🌙</button>

        {!adminLogged ? (
          <Link className="navbar-btn login" to="/admin-login">Admin</Link>
        ) : (
          <button className="navbar-btn logout" onClick={logoutAdmin}>
            Admin Logout
          </button>
        )}

        {user ? (
          <button className="navbar-btn logout" onClick={logoutUser}>
            Logout
          </button>
        ) : (
          <Link className="navbar-btn login" to="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
