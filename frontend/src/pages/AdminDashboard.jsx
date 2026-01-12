// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin guard
  useEffect(() => {
    if (localStorage.getItem("admin") !== "true") {
      navigate("/admin-login");
    }
  }, [navigate]);

  // Fetch reports from Firestore
  const fetchReports = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reports"));
      const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReports(fetched);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // 🔄 Resolve report
  const updateStatus = async (id) => {
    try {
      // Firestore reference
      const reportRef = doc(db, "reports", id);

      // Update status in Firestore
      await updateDoc(reportRef, { status: "resolved" });

      // Update local state immediately
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r))
      );
    } catch (err) {
      console.error("Error updating report:", err);
      alert("Failed to resolve report. Check console.");
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading reports...</p>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Category</th>
              <th>Reported By</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td data-label="Item">{r.name}</td>
                <td data-label="Description">{r.description}</td>
                <td data-label="Location">{r.location}</td>
                <td data-label="Contact">{r.contact}</td>
                <td data-label="Category">{r.category}</td>
                <td data-label="Reported By">{r.reportBy}</td>
                <td data-label="Status">
                  <span className={`status-badge status-${r.status}`}>
                    {r.status}
                  </span>
                </td>
                <td data-label="Action">
                  {r.status !== "resolved" ? (
                    <button onClick={() => updateStatus(r.id)}>
                      Resolve
                    </button>
                  ) : (
                    <span>Resolved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
