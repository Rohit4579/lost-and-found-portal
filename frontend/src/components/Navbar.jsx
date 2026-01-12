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

  // 👤 Firebase auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsub;
  }, []);

  // Navigate to Add Report page only if user is logged in
  const handleReportClick = () => {
    if (!user) {
      alert("You must login first!");
      navigate("/login");
      return;
    }
    navigate("/add");
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

  // ⛔ Block render until auth is stable
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
