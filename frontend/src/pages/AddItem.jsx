import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function AddItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    contact: "",
    category: "lost",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setLoggedUser(user.email);
      }
    });
    return unsub;
  }, [navigate]);

  const sanitize = (v) => v.replace(/[<>]/g, "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: sanitize(e.target.value) });
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedUser) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.name.length < 3) {
      setErrorMessage("Item name must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (formData.description.length < 10) {
      setErrorMessage("Description must be at least 10 characters");
      setLoading(false);
      return;
    }

    if (!isValidEmail(formData.contact)) {
      setErrorMessage("Enter a valid email");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        contact: formData.contact,
        category: formData.category,
        reportBy: loggedUser, // ✅ MATCHED NAME
        status: "pending",
        createdAt: new Date(),
      });

      setFormData({
        name: "",
        description: "",
        location: "",
        contact: "",
        category: "lost",
      });

      setSuccessMessage("Report submitted successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-container">
      <h2>Report Lost / Found Item</h2>

      {errorMessage && <p className="auth-msg error">{errorMessage}</p>}
      {successMessage && <p className="auth-msg success">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="add-item-form">
        <input name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <input name="contact" placeholder="Contact Email" value={formData.contact} onChange={handleChange} />

        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
