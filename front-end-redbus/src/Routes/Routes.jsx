import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";

import AdminLogin from "../Pages/Admin/AdminLogin";
import AdminDashboard from "../Pages/Admin/AdminDashboard";

import SelectBus from "../Components/SelectBus/SelectBus";
import Error from "../Components/Error/Error";
import Profile from "../Components/Profile Page/Profile";
import Payment from "../Components/Payment Page/Payment";
import BusBookingForm from "../Components/Bus Booking Form/BusBookingForm";
import LandingPage from "../Components/LandingPage/LandingPage";
import BusHire from "../Components/Bus hire Main Page/BusHire";
import BusServiceCardPage from "../Components/BusServiceSection/BusServiceCard/BusServiceCardPage";
import BusServiceDetailsPage from "../Components/BusServiceSection/BusServiceDetails/BusServiceDetailsPage";
import BusServicePaymentPage from "../Components/BusServiceSection/BusServicePayment/BusServivePaymentPage";


const Routes = () => {
  return (
    <Switch>

      <Route path="/" exact>
        <LandingPage />
      </Route>

      <Route path="/login" exact>
        <Login />
      </Route>

      <Route path="/register" exact>
        <Register />
      </Route>


      {/* Admin Routes */}
      <Route path="/admin-login" exact>
        <AdminLogin />
      </Route>

      <Route path="/admin-dashboard" exact>
        <AdminDashboard />
      </Route>


      <Route path="/select-bus" exact>
        <SelectBus />
      </Route>

      <Route path="/my-profile" exact>
        <Profile />
      </Route>

      <Route path="/payment-page" exact>
        <Payment />
      </Route>

      <Route path="/booking-form" exact>
        <BusBookingForm />
      </Route>

      <Route path="/bus-hire" exact>
        <BusHire />
      </Route>

      <Route path="/bus-hire-card" exact>
        <BusServiceCardPage />
      </Route>

      <Route path="/bus-hire-details/:id" exact>
        <BusServiceDetailsPage />
      </Route>

      <Route path="/payments-hire" exact>
        <BusServicePaymentPage />
      </Route>


      <Route>
        <Error />
      </Route>

    </Switch>
  );
};


export default Routes;