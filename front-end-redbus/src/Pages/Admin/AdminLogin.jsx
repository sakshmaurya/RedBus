import React, { useState } from "react";
import "./Admin.css";
import { useHistory } from "react-router-dom";

const AdminLogin = () => {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();

    if (email === "admin@redbus.com" && password === "admin123") {
      localStorage.setItem("admin", JSON.stringify({
  email: email,
  role: "admin"
}));
      alert("Admin Login Successful");
      history.push("/admin-dashboard");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-box">
        <h2>Admin Login</h2>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;