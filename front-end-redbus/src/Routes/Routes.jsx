import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";

import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Community from "../Pages/Community/Community";
import Forum from "../Pages/Forum/Forum";
import ForumTopic from "../Pages/Forum/ForumTopic";
import Notifications from "../Pages/Notifications/Notifications";
import NotificationPreferences from "../Pages/Notifications/NotificationPreferences";
import AdminLogin from "../Pages/Admin/AdminLogin";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import RoutePlanner from "../Pages/RoutePlanner/RoutePlanner";

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
    <RouterRoutes>

      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/community" element={<Community />} />

      <Route path="/forum" element={<Forum />} />

      <Route path="/forum/topic/:topicId" element={<ForumTopic />} />

      <Route path="/notifications" element={<Notifications />} />

      <Route path="/notifications/preferences" element={<NotificationPreferences />} />

      {/* Admin Routes */}
      <Route path="/admin-login" element={<AdminLogin />} />

      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      <Route path="/route-planner" element={<RoutePlanner />} />

      <Route path="/select-bus" element={<SelectBus />} />

      <Route path="/my-profile" element={<Profile />} />

      <Route path="/payment-page" element={<Payment />} />

      <Route path="/booking-form" element={<BusBookingForm />} />

      <Route path="/bus-hire" element={<BusHire />} />

      <Route path="/bus-hire-card" element={<BusServiceCardPage />} />

      <Route path="/bus-hire-details/:id" element={<BusServiceDetailsPage />} />

      <Route path="/payments-hire" element={<BusServicePaymentPage />} />

      <Route path="*" element={<Error />} />

    </RouterRoutes>
  );
};


export default Routes;