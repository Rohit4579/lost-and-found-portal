// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// ✅ Components (case-sensitive, explicit extensions)
import Layout from "./components/Layout.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

// ✅ Pages (case-sensitive, explicit extensions)
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import AddItem from "./pages/AddItem.jsx";
import Login from "./pages/Login.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/add" element={<AddItem />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Route */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
