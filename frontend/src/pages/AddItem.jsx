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
  
  // ✅ Track field-level errors
  const [errors, setErrors] = useState({});

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

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // ✅ Validate fields and update error state as user types
  const validateField = (name, value) => {
    let error = "";
    const val = value.trim();

    if (!val) {
      error = "This field is required";
    } else {
      if (name === "name" && val.length < 3) {
        error = "Item name must be at least 3 characters";
      }
      if (name === "description" && val.length < 10) {
        error = "Description must be at least 10 characters";
      }
      if (name === "contact" && !isValidEmail(val)) {
        error = "Enter a valid email";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: sanitize(value) });

    // ✅ Validate on change
    validateField(name, value);
    setSuccessMessage("");
  };

  const isFormValid = () => {
    return (
      formData.name.trim().length >= 3 &&
      formData.description.trim().length >= 10 &&
      formData.location.trim() !== "" &&
      isValidEmail(formData.contact) &&
      Object.values(errors).every((e) => e === "")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedUser) return;

    // ✅ Run validation for all fields before submit
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
    });

    if (!isFormValid()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "reports"), {
        ...formData,
        reportBy: loggedUser,
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
      setErrors({});
      setSuccessMessage("Report submitted successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to submit report" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-container">
      <h2>Report Lost / Found Item</h2>

      {errors.submit && <p className="auth-msg error">{errors.submit}</p>}
      {successMessage && <p className="auth-msg success">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-group">
          <input
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="field-error">{errors.description}</p>}
        </div>

        <div className="form-group">
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />
          {errors.location && <p className="field-error">{errors.location}</p>}
        </div>

        <div className="form-group">
          <input
            name="contact"
            placeholder="Contact Email"
            value={formData.contact}
            onChange={handleChange}
          />
          {errors.contact && <p className="field-error">{errors.contact}</p>}
        </div>

        <div className="form-group">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        <button disabled={loading || !isFormValid()}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
