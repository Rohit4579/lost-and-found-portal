import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ lost: 0, found: 0, total: 0 });
  const [user, setUser] = useState(null);

  // Firebase Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsub;
  }, []);

  // Fetch statistics from Firestore
  useEffect(() => {
    const fetchStats = async () => {
      const reportsRef = collection(db, "reports");
      const lostSnap = await getDocs(query(reportsRef, where("category", "==", "lost")));
      const foundSnap = await getDocs(query(reportsRef, where("category", "==", "found")));
      const allSnap = await getDocs(reportsRef);

      setStats({ lost: lostSnap.size, found: foundSnap.size, total: allSnap.size });
    };

    fetchStats();
  }, []);

  const handleReportClick = () => {
    if (!user) {
      alert("Please login first to report an item.");
      navigate("/login");
      return;
    }
    navigate("/add");
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to D.Y.P.T.C Lost & Found Portal</h1>
      <div className="stats-box">
        <div className="stat-card">
          <h2>{stats.lost}</h2>
          <p>Lost Items</p>
        </div>
        <div className="stat-card">
          <h2>{stats.found}</h2>
          <p>Found Items</p>
        </div>
        <div className="stat-card">
          <h2>{stats.total}</h2>
          <p>Total Reports</p>
        </div>
      </div>
      <button className="btn-report" onClick={handleReportClick}>Report an Item</button>
    </div>
  );
}
