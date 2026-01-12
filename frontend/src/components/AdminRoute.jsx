// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("admin") === "true";

  return isAdmin ? children : <Navigate to="/admin-login" replace />;
}
