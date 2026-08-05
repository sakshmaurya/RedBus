import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Admin.css";

const AdminDashboard = () => {

  const history = useHistory();

  const admin = JSON.parse(localStorage.getItem("admin"));


  useEffect(() => {

    if(!admin){
      history.push("/admin-login");
    }

  }, [admin, history]);


  const logout = () => {

    localStorage.removeItem("admin");

    history.push("/admin-login");

  };


  return (
    <div className="dashboard">

      <div className="admin-header">

        <h1>
          Welcome Admin 👋
        </h1>

        <p>
          Logged in as: {admin?.email}
        </p>


       

      </div>


      <div className="cards">

        <div className="card">
          <h2>Total Users</h2>
          <h1>0</h1>
        </div>


        <div className="card">
          <h2>Total Buses</h2>
          <h1>0</h1>
        </div>


        <div className="card">
          <h2>Total Bookings</h2>
          <h1>0</h1>
        </div>


        <div className="card">
          <h2>Total Revenue</h2>
          <h1>₹0</h1>
        </div>


      </div>

    </div>
  );
};


export default AdminDashboard;