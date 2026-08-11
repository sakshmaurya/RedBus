import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/auth/actions";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.email || !form.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        form
      );

      // Save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.customer));

      // Update Redux
      dispatch(loginSuccess(res.data.customer));

      setLoading(false);
      alert("Login Successful");
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login Failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{t('auth.loginTitle')}</h2>

        <form onSubmit={login}>
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
            type="email"
            name="email"
            placeholder={t('auth.email')}
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder={t('auth.password')}
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? t('common.loading') : t('auth.loginTitle')}
          </button>
        </form>

        <p>
          {t('auth.dontHaveAccount')}
          <span
            onClick={() => !loading && navigate("/register")}
            style={{
              color: loading ? "#999" : "#d84e55",
              cursor: loading ? "not-allowed" : "pointer",
              marginLeft: "5px",
              fontWeight: "bold",
            }}
          >
            {t('auth.createAccount')}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;