import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../index.css";

export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    phone: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setFormData({
      firstname: "",
      lastname: "",
      username: "",
      phone: "",
      email: "",
      password: "",
    });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      if (isSignup) {
        localStorage.setItem("isSigningUp", "true");

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          firstname: formData.firstname,
          lastname: formData.lastname,
          username: formData.username,
          phone: formData.phone,
          email: formData.email,
          createdAt: new Date(),
        });

        await signOut(auth);
        localStorage.removeItem("isSigningUp");

        setMessage({
          type: "success",
          text: "Account created! Please login.",
        });

        setIsSignup(false);
        resetForm();
      } else {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        setMessage({ type: "success", text: "Login Successful!" });
        resetForm();
        navigate("/");
      }
    } catch (err) {
      localStorage.removeItem("isSigningUp");
      setMessage({
        type: "error",
        text: isSignup ? err.message : "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isSignup ? "Create Account" : "Login"}</h2>

      {message.text && (
        <p className={`auth-msg ${message.type}`}>{message.text}</p>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {isSignup && (
          <>
            <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required />
            <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required />
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          </>
        )}

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading
            ? isSignup
              ? "Signing Up..."
              : "Logging In..."
            : isSignup
            ? "Sign Up"
            : "Login"}
        </button>
      </form>

      <p
        className="toggle-auth"
        onClick={() => {
          setIsSignup(!isSignup);
          resetForm();
        }}
      >
        {isSignup
          ? "Already have an account? Login"
          : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
}
