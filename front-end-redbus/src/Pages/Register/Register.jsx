import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || formData.name.trim().length < 2) {
      setError("Please enter a valid name (at least 2 characters)");
      return;
    }
    if (!formData.email || !formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!formData.age || formData.age < 18 || formData.age > 100) {
      setError("Age must be between 18 and 100");
      return;
    }
    if (!formData.gender) {
      setError("Please select a gender");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/register",
        formData
      );

      setLoading(false);
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration Failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>{t('auth.registerTitle')}</h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{
              color: "#d84e55",
              backgroundColor: "#ffebee",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          <input
            type="text"
            name="name"
            placeholder={t('auth.name')}
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder={t('auth.email')}
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder={t('auth.password')}
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="number"
            name="age"
            placeholder={t('auth.age')}
            value={formData.age}
            onChange={handleChange}
            min="18"
            max="100"
            disabled={loading}
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">{t('auth.gender')}</option>
            <option value="Male">{t('booking.male')}</option>
            <option value="Female">{t('booking.female')}</option>
            <option value="Other">{t('booking.other')}</option>
          </select>

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? t('common.loading') : t('auth.createAccount')}
          </button>
        </form>

        <p>
          {t('auth.alreadyHaveAccount')}
          <span
            style={{
              color: loading ? "#999" : "blue",
              cursor: loading ? "not-allowed" : "pointer",
              marginLeft: "5px",
            }}
            onClick={() => !loading && navigate("/login")}
          >
            {t('auth.loginTitle')}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;