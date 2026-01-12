import React, { useEffect, useRef, useState } from "react";
import "../index.css";
import collegeImg from "../assets/college.jpg";

export default function About() {
  const visionRef = useRef(null);
  const imageRef = useRef(null);
  const missionRef = useRef(null);
  const parallaxRef = useRef(null);

  const [showVision, setShowVision] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    // Intersection Observer for fade-in sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === visionRef.current && entry.isIntersecting) setShowVision(true);
          if (entry.target === imageRef.current && entry.isIntersecting) setShowImage(true);
          if (entry.target === missionRef.current && entry.isIntersecting) setShowMission(true);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(visionRef.current);
    observer.observe(imageRef.current);
    observer.observe(missionRef.current);

    return () => observer.disconnect();
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) setOffsetY(window.scrollY * 0.4);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="about-page">

      {/* ===== TOP PORTAL INFO ===== */}
      <section className="section about-top">
        <div className="container">
          <h1 className="about-title">About D.Y.P.T.C Lost & Found Portal</h1>
          <p className="about-text">
            The D.Y.P.T.C Lost & Found Portal helps students and faculty efficiently report, track,
            and recover misplaced belongings within the campus.
          </p>
          <p className="about-text">
            Through secure authentication, image-based reporting, and admin-verified claims,
            the platform ensures transparency, trust, and faster resolution of lost items.
          </p>
        </div>
      </section>

      {/* ===== VISION SECTION ===== */}
      <section className="section about-vision">
        <div className="container vision-layout">
          <div ref={visionRef} className={`vision-content ${showVision ? "vision-visible" : ""}`}>
            <h2 className="about-subtitle">Our Vision</h2>
            <p className="about-text">
              D.Y. Patil Technical Campus envisions a digitally connected academic environment
              that promotes responsibility, innovation, and ethical ownership.
            </p>
            <p className="about-text">
              By integrating intelligent systems like the Lost & Found Portal, the institution
              strives to enhance campus life through technology, collaboration, and trust.
            </p>
            <blockquote className="about-quote">
              "Empowering a responsible campus through smart digital solutions."
            </blockquote>
          </div>

          <div ref={imageRef} className={`vision-image ${showImage ? "image-visible" : ""}`}>
            <img src={collegeImg} alt="DYPTC Campus" />
          </div>
        </div>
      </section>

      {/* ===== MISSION SECTION ===== */}
      <section className="section about-mission">
        <div ref={missionRef} className={`mission-content ${showMission ? "mission-visible" : ""}`}>
          <div className="container">
            <h2 className="about-subtitle center">Our Mission</h2>
            <div className="mission-cards">
              <div className="mission-card">
                <h3>Efficiency</h3>
                <p>Streamline lost and found processes for students and faculty.</p>
              </div>
              <div className="mission-card">
                <h3>Transparency</h3>
                <p>Ensure all reports and claims are tracked securely and openly.</p>
              </div>
              <div className="mission-card">
                <h3>Collaboration</h3>
                <p>Encourage students and staff to actively participate and help each other.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
