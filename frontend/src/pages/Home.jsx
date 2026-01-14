// src/pages/Home.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ lost: 0, found: 0, total: 0 });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const statCardsRef = useRef([]);

  /* 🔐 Auth */
  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  /* 🔴 Realtime Firestore */
  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReports(data);

      const lost = data.filter((r) => r.category === "lost").length;
      const found = data.filter((r) => r.category === "found").length;

      setStats({ lost, found, total: data.length });

      // Trigger pulse animation on update
      statCardsRef.current.forEach((card) => {
        if (card) {
          card.classList.add("pulse");
          setTimeout(() => card.classList.remove("pulse"), 600);
        }
      });
    });
  }, []);

  /* 🔍 Filter logic */
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const q = search.toLowerCase();
      const matchText =
        item.name?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q);

      const matchCategory = filter === "all" || item.category === filter;

      return matchText && matchCategory;
    });
  }, [reports, search, filter]);

  const handleReportClick = () => {
    if (!user) return navigate("/login");
    navigate("/add");
  };

  const lostPercent = stats.total ? (stats.lost / stats.total) * 100 : 0;
  const foundPercent = stats.total ? (stats.found / stats.total) * 100 : 0;

  return (
    <div className="home-container">
      <div className="home-inner">
        {/* HERO */}
        <section className="home-hero">
          <h1 className="home-title">D.Y.P.T.C Lost & Found Portal</h1>
          <p className="home-subtitle">
            Realtime tracking of lost & found items
          </p>
        </section>

        {/* STATS */}
        <section className="home-stats-section">
          <div className="stats-box">
            <div
              className="stat-card lost"
              ref={(el) => (statCardsRef.current[0] = el)}
            >
              <h2 style={{ opacity: stats.lost === 0 ? 0.4 : 1 }}>
                {stats.lost || "—"}
              </h2>
              <p>Lost Items</p>
            </div>
            <div
              className="stat-card found"
              ref={(el) => (statCardsRef.current[1] = el)}
            >
              <h2 style={{ opacity: stats.found === 0 ? 0.4 : 1 }}>
                {stats.found || "—"}
              </h2>
              <p>Found Items</p>
            </div>
            <div
              className="stat-card total"
              ref={(el) => (statCardsRef.current[2] = el)}
            >
              <h2 style={{ opacity: stats.total === 0 ? 0.4 : 1 }}>
                {stats.total || "—"}
              </h2>
              <p>Total Reports</p>
            </div>
          </div>
        </section>

        {/* CHART */}
        <section className="home-chart">
          <h3>Lost vs Found</h3>
          <div className="chart-bars">
            <div className="bar lost-bar">
              <span style={{ height: `${lostPercent}%` }} />
              <label>Lost</label>
            </div>
            <div className="bar found-bar">
              <span style={{ height: `${foundPercent}%` }} />
              <label>Found</label>
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <section className="home-search">
          <input
            placeholder="Search item or location..."
            aria-label="Search reports"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter reports"
          >
            <option value="all">All</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </section>

        {/* ACTIVITY */}
        <section className="home-activity">
          <h3>Live Reports</h3>

          <div className="activity-list">
            {filteredReports.length === 0 && (
              <p className="activity-empty">No matching reports</p>
            )}

            {filteredReports.slice(0, 8).map((item) => (
              <div key={item.id} className="activity-item">
                <span className={`badge ${item.category}`}>
                  {item.category}
                </span>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="home-cta">
          <button className="btn-report" onClick={handleReportClick}>
            Report an Item
          </button>
        </section>
      </div>
    </div>
  );
}
