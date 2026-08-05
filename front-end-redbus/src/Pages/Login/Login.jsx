import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/auth/actions";

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

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

      alert("Login Successful");

      history.push("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={login}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account?
          <span
            onClick={() => history.push("/register")}
            style={{
              color: "#d84e55",
              cursor: "pointer",
              marginLeft: "5px",
              fontWeight: "bold",
            }}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;