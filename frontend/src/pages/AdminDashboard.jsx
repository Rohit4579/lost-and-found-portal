import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Simple admin guard
  useEffect(() => {
    if (localStorage.getItem("admin") !== "true") {
      navigate("/admin-login");
    }
  }, [navigate]);

  // 📥 Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snapshot = await getDocs(collection(db, "reports"));
        setReports(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // 🔄 Update status
  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "reports", id), { status });
      setReports(prev =>
        prev.map(r => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  if (loading) return <p>Loading...</p>;

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
            {reports.map(r => (
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
                  {r.status !== "resolved" && (
                    <button onClick={() => updateStatus(r.id, "resolved")}>
                      Resolve
                    </button>
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
