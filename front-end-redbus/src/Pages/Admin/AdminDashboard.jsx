import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = localStorage.getItem("token") || "";

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("overview");

  // Main Datasets
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    totalPosts: 0,
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    totalBuses: 0,
    totalRoutes: 0,
    totalReports: 0,
    totalReviewReports: 0,
    totalReviews: 0,
  });

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviewReports, setReviewReports] = useState([]);
  const [communityReports, setCommunityReports] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  // Search/Filter states
  const [busSearch, setBusSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  // Modal dialog states
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Form states
  const [busForm, setBusForm] = useState({
    operatorName: "",
    busNumber: "",
    busType: "AC Sleeper (2+1)",
    routes: "",
    fare: 850,
    totalSeats: 40,
    departureTime: "21:00",
    status: "active",
    images: "https://st.redbus.in/Images/rdc/rdc-redbus-logo.svg",
    liveTracking: 1,
    reschedulable: 1,
  });

  const [routeForm, setRouteForm] = useState({
    departureLocation: "",
    arrivalLocation: "",
    duration: 180,
  });

  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    coupon: "REDBUSPROMO",
  });

  const [adminCommentText, setAdminCommentText] = useState({});

  // Headers for admin-protected routes
  const adminHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-admin-auth": "true",
    },
  };

  const showFeedback = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(""), 4000);
  };

  // Fetch all core resources
  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/admin/stats`
      );
      if (res.data?.stats) setStats(res.data.stats);
    } catch (err) {
      console.log("Error fetching stats:", err);
    }
  }, []);

  const fetchBuses = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/stats/all`
      );
      if (res.data?.busStats) {
        setBuses(res.data.busStats);
      } else {
        const fallback = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/`
        );
        setBuses(fallback.data?.buses || []);
      }
    } catch (err) {
      console.log("Error fetching buses:", err);
    }
  }, []);

  const fetchRoutes = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/routes`
      );
      setRoutes(res.data || []);
    } catch (err) {
      console.log("Error fetching routes:", err);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/bookings/all`
      );
      setBookings(res.data?.bookings || []);
    } catch (err) {
      console.log("Error fetching bookings:", err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/customers/all`
      );
      setUsers(res.data?.users || []);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  }, []);

  const fetchReviewReports = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/review-reports`,
        adminHeaders
      );
      setReviewReports(res.data?.reports || []);
    } catch (err) {
      console.log("Error fetching review reports:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCommunityReports = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/reports`
      );
      setCommunityReports(res.data?.reports || []);
    } catch (err) {
      console.log("Error fetching community reports:", err);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/posts/all`
      );
      setPosts(res.data?.posts || []);
    } catch (err) {
      console.log("Error fetching posts:", err);
    }
  }, []);

  useEffect(() => {
    if (!admin) {
      navigate("/admin-login");
      return;
    }

    setLoading(true);
    Promise.all([
      fetchStats(),
      fetchBuses(),
      fetchRoutes(),
      fetchBookings(),
      fetchUsers(),
      fetchReviewReports(),
      fetchCommunityReports(),
      fetchPosts(),
    ]).finally(() => setLoading(false));
  }, [
    admin,
    navigate,
    fetchStats,
    fetchBuses,
    fetchRoutes,
    fetchBookings,
    fetchUsers,
    fetchReviewReports,
    fetchCommunityReports,
    fetchPosts,
  ]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin-login");
  };

  // BUS OPERATIONS
  const handleCreateBus = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/buses`,
        busForm
      );
      setShowAddBusModal(false);
      fetchBuses();
      fetchStats();
      showFeedback("New Bus added to fleet successfully! 🚌");
      setBusForm({
        operatorName: "",
        busNumber: "",
        busType: "AC Sleeper (2+1)",
        routes: "",
        fare: 850,
        totalSeats: 40,
        departureTime: "21:00",
        status: "active",
        images: "https://st.redbus.in/Images/rdc/rdc-redbus-logo.svg",
        liveTracking: 1,
        reschedulable: 1,
      });
    } catch (err) {
      alert("Failed to create bus: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteBus = async (busId) => {
    if (!window.confirm("Are you sure you want to delete this bus from the fleet?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/api/buses/${busId}`);
      fetchBuses();
      fetchStats();
      showFeedback("Bus deleted from fleet.");
    } catch (err) {
      alert("Error deleting bus: " + err.message);
    }
  };

  const handleToggleBusStatus = async (bus) => {
    const nextStatus = bus.status === "active" ? "maintenance" : bus.status === "maintenance" ? "inactive" : "active";
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/api/buses/${bus.busId || bus._id}`, {
        status: nextStatus,
      });
      fetchBuses();
      showFeedback(`Bus status changed to ${nextStatus.toUpperCase()}`);
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  // ROUTE OPERATIONS
  const handleCreateRoute = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/routes`,
        routeForm
      );
      setShowAddRouteModal(false);
      fetchRoutes();
      fetchStats();
      showFeedback("New travel route configured successfully! 🛣️");
      setRouteForm({ departureLocation: "", arrivalLocation: "", duration: 180 });
    } catch (err) {
      alert("Failed to create route: " + err.message);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/api/routes/${routeId}`);
      fetchRoutes();
      fetchStats();
      showFeedback("Route deleted.");
    } catch (err) {
      alert("Error deleting route: " + err.message);
    }
  };

  // BOOKING OPERATIONS
  const handleUpdateJourneyStatus = async (bookingId, journeyStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/bookings/${bookingId}/journey-status`,
        { journeyStatus }
      );
      fetchBookings();
      fetchStats();
      showFeedback(`Booking journey status updated to ${journeyStatus} (Traveler notified! 🔔)`);
    } catch (err) {
      alert("Failed to update journey status: " + err.message);
    }
  };

  // USER OPERATIONS
  const handleToggleUserVerification = async (userId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/customers/${userId}/verify`
      );
      fetchUsers();
      fetchStats();
      showFeedback("Traveler verification status toggled! ✅");
    } catch (err) {
      alert("Error toggling verification: " + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customers/${userId}`);
      fetchUsers();
      fetchStats();
      showFeedback("User account deleted.");
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  // REVIEW MODERATION
  const handleUpdateReviewStatus = async (reviewId, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/reviews/${reviewId}/status`,
        { status, adminNote: `Moderated by admin to ${status}` },
        adminHeaders
      );
      fetchReviewReports();
      fetchStats();
      showFeedback(`Review status updated to ${status}. Route ratings recalculated.`);
    } catch (err) {
      alert("Failed to update review status: " + err.message);
    }
  };

  const handleResolveReviewReport = async (reportId, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/review-reports/${reportId}/status`,
        { status, adminNote: "Report reviewed by administrator" },
        adminHeaders
      );
      fetchReviewReports();
      fetchStats();
      showFeedback(`Review report marked as ${status}.`);
    } catch (err) {
      alert("Failed to update report status: " + err.message);
    }
  };

  // COMMUNITY MODERATION
  const handleHidePost = async (postId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/posts/${postId}/status`,
        { status: "hidden" }
      );
      fetchPosts();
      showFeedback("Post hidden from community.");
    } catch (err) {
      alert("Failed to update post status: " + err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this community post?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/api/posts/${postId}`);
      fetchPosts();
      fetchCommunityReports();
      fetchStats();
      showFeedback("Post deleted.");
    } catch (err) {
      alert("Failed to delete post: " + err.message);
    }
  };

  const handlePinPost = async (postId) => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/v1/api/posts/${postId}/pin`);
      fetchPosts();
      showFeedback("Post pinned to top of community.");
    } catch (err) {
      alert("Failed to pin post: " + err.message);
    }
  };

  const handleAddAdminComment = async (postId) => {
    const text = adminCommentText[postId];
    if (!text || !text.trim()) return;
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/comments`, {
        postId,
        author: admin._id || "600000000000000000000001",
        authorName: "RedBus Official Admin 🛡️",
        text,
      });
      setAdminCommentText({ ...adminCommentText, [postId]: "" });
      fetchPosts();
      showFeedback("Official admin comment published!");
    } catch (err) {
      alert("Failed to add comment: " + err.message);
    }
  };

  // NOTIFICATION OPERATIONS
  const handleBroadcastPromo = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/notifications/promotion`,
        {
          recipient: users[0]?._id, // Broadcasts or sends to eligible users
          coupon: broadcastForm.coupon,
          details: broadcastForm.message,
        }
      );
      setShowBroadcastModal(false);
      showFeedback("Promotional offer broadcasted to travelers! 🎁");
    } catch (err) {
      alert("Failed to broadcast promo: " + err.message);
    }
  };

  const handleRetryFailedNotifications = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/notifications/retry`);
      showFeedback("Failed notifications retried through all delivery channels! 🔄");
    } catch (err) {
      alert("Failed to retry notifications: " + err.message);
    }
  };

  // Filtered Lists
  const filteredBuses = buses.filter(
    (b) =>
      b.operatorName?.toLowerCase().includes(busSearch.toLowerCase()) ||
      b.busNumber?.toLowerCase().includes(busSearch.toLowerCase()) ||
      b.busType?.toLowerCase().includes(busSearch.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (b) =>
      b._id?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      (b.passengerDetails &&
        b.passengerDetails.some((p) =>
          p.name?.toLowerCase().includes(bookingSearch.toLowerCase())
        ))
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="admin-portal">
      {/* SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img
            src="https://st.redbus.in/Images/rdc/rdc-redbus-logo.svg"
            alt="RedBus Logo"
            className="admin-sidebar-logo"
          />
          <div>
            <div className="admin-sidebar-title">redBus Admin</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>Fleet & Ops Suite</div>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <div
            className={`admin-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <div className="admin-nav-item-left">
              <span>📊</span>
              <span>Overview</span>
            </div>
          </div>

          <div
            className={`admin-nav-item ${activeTab === "buses" ? "active" : ""}`}
            onClick={() => setActiveTab("buses")}
          >
            <div className="admin-nav-item-left">
              <span>🚌</span>
              <span>Bus Fleet</span>
            </div>
            <span className="admin-nav-badge" style={{ backgroundColor: "#3b82f6" }}>
              {buses.length}
            </span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === "routes" ? "active" : ""}`}
            onClick={() => setActiveTab("routes")}
          >
            <div className="admin-nav-item-left">
              <span>🛣️</span>
              <span>Bus Routes</span>
            </div>
            <span className="admin-nav-badge" style={{ backgroundColor: "#8b5cf6" }}>
              {routes.length}
            </span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            <div className="admin-nav-item-left">
              <span>🎫</span>
              <span>Bookings</span>
            </div>
            <span className="admin-nav-badge" style={{ backgroundColor: "#10b981" }}>
              {bookings.length}
            </span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <div className="admin-nav-item-left">
              <span>👥</span>
              <span>Travelers</span>
            </div>
            <span className="admin-nav-badge" style={{ backgroundColor: "#64748b" }}>
              {users.length}
            </span>
          </div>

          <div
            className={`admin-nav-item ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            <div className="admin-nav-item-left">
              <span>⭐</span>
              <span>Review Moderation</span>
            </div>
            {reviewReports.length > 0 && (
              <span className="admin-nav-badge">{reviewReports.length}</span>
            )}
          </div>

          <div
            className={`admin-nav-item ${activeTab === "community" ? "active" : ""}`}
            onClick={() => setActiveTab("community")}
          >
            <div className="admin-nav-item-left">
              <span>💬</span>
              <span>Community & Forum</span>
            </div>
            {communityReports.length > 0 && (
              <span className="admin-nav-badge">{communityReports.length}</span>
            )}
          </div>

          <div
            className={`admin-nav-item ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <div className="admin-nav-item-left">
              <span>🔔</span>
              <span>Notifications</span>
            </div>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <span>🚪</span>
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="admin-main">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>
              {activeTab === "overview" && "Executive Dashboard"}
              {activeTab === "buses" && "Bus Fleet & Vehicle Inventory"}
              {activeTab === "routes" && "Travel Corridors & Route Networks"}
              {activeTab === "bookings" && "Booking Operations & Journey Tracking"}
              {activeTab === "users" && "Traveler Accounts & Verification"}
              {activeTab === "reviews" && "Review Moderation Queue"}
              {activeTab === "community" && "Community & Discussion Forum Moderation"}
              {activeTab === "notifications" && "Broadcast & Notification Center"}
            </h1>
            <div className="admin-topbar-subtitle">
              RedBus Central Operations Center • Live Synchronized
            </div>
          </div>

          <div className="admin-topbar-profile">
            <div className="admin-user-pill">
              <div className="admin-avatar">
                {admin?.email ? admin.email.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600" }}>{admin?.email || "Admin User"}</div>
                <div style={{ fontSize: "11px", color: "#10b981", fontWeight: "bold" }}>● Operations Lead</div>
              </div>
            </div>
          </div>
        </header>

        {/* NOTIFICATION FEEDBACK TOAST */}
        {actionSuccess && (
          <div
            style={{
              margin: "20px 30px 0 30px",
              padding: "14px 20px",
              backgroundColor: "#dcfce7",
              border: "1px solid #86efac",
              color: "#15803d",
              borderRadius: "8px",
              fontWeight: "600",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{actionSuccess}</span>
            <button
              onClick={() => setActionSuccess("")}
              style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}
            >
              ✕
            </button>
          </div>
        )}

        <div className="admin-content">
          {loading && <div style={{ marginBottom: "20px", color: "#64748b" }}>Loading RedBus operations data...</div>}

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "overview" && (
            <div>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Total Revenue</span>
                    <span className="admin-stat-icon">💰</span>
                  </div>
                  <div className="admin-stat-value">₹{stats.totalRevenue?.toLocaleString()}</div>
                  <div className="admin-stat-sub">From {stats.totalBookings} ticket transactions</div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Total Bookings</span>
                    <span className="admin-stat-icon">🎫</span>
                  </div>
                  <div className="admin-stat-value">{stats.totalBookings}</div>
                  <div className="admin-stat-sub">
                    {stats.upcomingBookings} Upcoming • {stats.completedBookings} Completed
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Bus Fleet</span>
                    <span className="admin-stat-icon">🚌</span>
                  </div>
                  <div className="admin-stat-value">{buses.length}</div>
                  <div className="admin-stat-sub">Operating across {routes.length} corridors</div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Registered Travelers</span>
                    <span className="admin-stat-icon">👥</span>
                  </div>
                  <div className="admin-stat-value">{stats.totalUsers}</div>
                  <div className="admin-stat-sub">{stats.verifiedUsers} Verified Travelers</div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Reviews</span>
                    <span className="admin-stat-icon">⭐</span>
                  </div>
                  <div className="admin-stat-value">{stats.totalReviews}</div>
                  <div className="admin-stat-sub">{reviewReports.length} pending moderation</div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Community Reports</span>
                    <span className="admin-stat-icon">🚩</span>
                  </div>
                  <div className="admin-stat-value">{communityReports.length}</div>
                  <div className="admin-stat-sub">{stats.totalPosts} active traveler stories</div>
                </div>
              </div>

              {/* RECENT BOOKINGS WIDGET */}
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h2>Recent Booking Transactions</h2>
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setActiveTab("bookings")}
                  >
                    View All Bookings →
                  </button>
                </div>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Passenger</th>
                        <th>Seats</th>
                        <th>Fare</th>
                        <th>Journey Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b._id}>
                          <td style={{ fontFamily: "monospace" }}>{b._id.substring(0, 10)}...</td>
                          <td>{b.passengerDetails?.[0]?.name || "Traveler"}</td>
                          <td>{(b.seats || []).join(", ") || "1"}</td>
                          <td>₹{b.fare}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                (b.journeyStatus || b.status || "upcoming").toLowerCase()
                              }`}
                            >
                              {b.journeyStatus || b.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="admin-btn admin-btn-secondary"
                              style={{ padding: "4px 8px", fontSize: "11px" }}
                              onClick={() => setActiveTab("bookings")}
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUS FLEET MANAGEMENT */}
          {activeTab === "buses" && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2>Fleet Overview ({filteredBuses.length})</h2>
                <div className="admin-panel-actions">
                  <input
                    type="text"
                    placeholder="Search bus, operator, type..."
                    className="admin-search-input"
                    value={busSearch}
                    onChange={(e) => setBusSearch(e.target.value)}
                  />
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => setShowAddBusModal(true)}
                  >
                    + Add New Bus
                  </button>
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Operator</th>
                      <th>Bus Number</th>
                      <th>Type</th>
                      <th>Seats (Booked / Total)</th>
                      <th>Occupancy</th>
                      <th>Fare</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBuses.map((bus) => {
                      const totalSeats = bus.totalSeats || 40;
                      const bookedSeats = bus.bookedSeats || 0;
                      const occRate = bus.occupancyRate || (totalSeats ? Math.round((bookedSeats / totalSeats) * 100) : 0);
                      const busId = bus.busId || bus._id;

                      return (
                        <tr key={busId}>
                          <td>
                            <strong>{bus.operatorName}</strong>
                          </td>
                          <td style={{ fontFamily: "monospace" }}>{bus.busNumber || "MH-01-EXP"}</td>
                          <td>{bus.busType}</td>
                          <td>
                            {bookedSeats} / {totalSeats}
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div
                                style={{
                                  width: "60px",
                                  height: "6px",
                                  backgroundColor: "#e2e8f0",
                                  borderRadius: "3px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${occRate}%`,
                                    height: "100%",
                                    backgroundColor: occRate > 80 ? "#ef4444" : occRate > 50 ? "#f59e0b" : "#10b981",
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: "12px" }}>{occRate}%</span>
                            </div>
                          </td>
                          <td>₹{bus.fare || 800}</td>
                          <td>
                            <span className={`status-badge ${(bus.status || "active").toLowerCase()}`}>
                              {bus.status || "active"}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: "4px 8px", fontSize: "11px" }}
                                onClick={() => handleToggleBusStatus(bus)}
                              >
                                Toggle Status
                              </button>
                              <button
                                className="admin-btn admin-btn-danger"
                                style={{ padding: "4px 8px", fontSize: "11px" }}
                                onClick={() => handleDeleteBus(busId)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ROUTE MANAGEMENT */}
          {activeTab === "routes" && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2>Bus Routes & Corridors ({routes.length})</h2>
                <div className="admin-panel-actions">
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => setShowAddRouteModal(true)}
                  >
                    + Add New Route
                  </button>
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Est. Duration</th>
                      <th>Route ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((r) => (
                      <tr key={r._id}>
                        <td>
                          <strong>{r.departureLocation?.name || "Origin"}</strong>
                        </td>
                        <td>
                          <strong>{r.arrivalLocation?.name || "Destination"}</strong>
                        </td>
                        <td>
                          {Math.floor((r.duration || 180) / 60)}h {(r.duration || 180) % 60}m
                        </td>
                        <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{r._id}</td>
                        <td>
                          <button
                            className="admin-btn admin-btn-danger"
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                            onClick={() => handleDeleteRoute(r._id)}
                          >
                            Delete Route
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BOOKINGS MANAGEMENT */}
          {activeTab === "bookings" && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2>Booking Operations ({filteredBookings.length})</h2>
                <div className="admin-panel-actions">
                  <input
                    type="text"
                    placeholder="Search passenger or Booking ID..."
                    className="admin-search-input"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Passenger</th>
                      <th>Contact Details</th>
                      <th>Seats</th>
                      <th>Fare</th>
                      <th>Journey Status</th>
                      <th>Update Journey</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr key={b._id}>
                        <td style={{ fontFamily: "monospace", fontSize: "12px" }}>
                          {b._id.substring(0, 12)}...
                        </td>
                        <td>
                          <strong>{b.passengerDetails?.[0]?.name || "Traveler"}</strong>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            Age: {b.passengerDetails?.[0]?.age || "N/A"} • Gender:{" "}
                            {b.passengerDetails?.[0]?.gender || "N/A"}
                          </div>
                        </td>
                        <td>{b.email || b.phoneNumber || "Verified Account"}</td>
                        <td>
                          <strong>{(b.seats || []).join(", ") || "1 Seat"}</strong>
                        </td>
                        <td>₹{b.fare}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              (b.journeyStatus || b.status || "upcoming").toLowerCase()
                            }`}
                          >
                            {b.journeyStatus || b.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={b.journeyStatus || "UPCOMING"}
                            onChange={(e) => handleUpdateJourneyStatus(b._id, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              border: "1px solid #cbd5e1",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            <option value="UPCOMING">UPCOMING</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: TRAVELERS / USERS */}
          {activeTab === "users" && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2>Registered Travelers ({filteredUsers.length})</h2>
                <div className="admin-panel-actions">
                  <input
                    type="text"
                    placeholder="Search traveler by name, email..."
                    className="admin-search-input"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Traveler Name</th>
                      <th>Email</th>
                      <th>Verified Status</th>
                      <th>Trusted Reviewer</th>
                      <th>Language / Theme</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <strong>{u.name}</strong>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          {u.isVerifiedTraveler ? (
                            <span className="status-badge active">✓ Verified</span>
                          ) : (
                            <span className="status-badge pending">Unverified</span>
                          )}
                        </td>
                        <td>
                          {u.isTrustedReviewer ? (
                            <span className="status-badge visible">⭐ Trusted</span>
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: "12px" }}>Standard</span>
                          )}
                        </td>
                        <td style={{ fontSize: "12px" }}>
                          Lang: {u.language || "en"} • Theme: {u.theme || "light"}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              className="admin-btn admin-btn-secondary"
                              style={{ padding: "4px 8px", fontSize: "11px" }}
                              onClick={() => handleToggleUserVerification(u._id)}
                            >
                              {u.isVerifiedTraveler ? "Revoke Verification" : "Mark Verified"}
                            </button>
                            <button
                              className="admin-btn admin-btn-danger"
                              style={{ padding: "4px 8px", fontSize: "11px" }}
                              onClick={() => handleDeleteUser(u._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: REVIEW MODERATION */}
          {activeTab === "reviews" && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2>Reported Route Reviews ({reviewReports.length})</h2>
              </div>

              {reviewReports.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                  🎉 No reported reviews requiring moderation. All community reviews are clean!
                </div>
              ) : (
                <div style={{ padding: "20px", display: "grid", gap: "15px" }}>
                  {reviewReports.map((rep) => (
                    <div
                      key={rep._id}
                      style={{
                        padding: "18px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        backgroundColor: "#f8fafc",
                        borderLeft: "4px solid #d84e55",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <div>
                          <strong>Report Reason: {rep.reason}</strong>
                          <span style={{ fontSize: "12px", color: "#64748b", marginLeft: "10px" }}>
                            Reported by: {rep.reportedBy?.name || "Traveler"}
                          </span>
                        </div>
                        <span className={`status-badge ${(rep.status || "pending").toLowerCase()}`}>
                          {rep.status}
                        </span>
                      </div>

                      {rep.review ? (
                        <div style={{ margin: "10px 0" }}>
                          <div style={{ fontWeight: "600", color: "#d84e55", marginBottom: "4px" }}>
                            Rating: {"⭐".repeat(rep.review.rating || 5)} ({rep.review.rating}/5)
                          </div>
                          <p style={{ margin: "4px 0", fontStyle: "italic", color: "#334155" }}>
                            "{rep.review.reviewText}"
                          </p>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            Reviewer: {rep.review.user?.name} • Status: {rep.review.status}
                          </div>
                        </div>
                      ) : (
                        <div style={{ color: "#ef4444", fontWeight: "bold" }}>Review was deleted or not found</div>
                      )}

                      <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                        {rep.review && (
                          <>
                            <button
                              className="admin-btn admin-btn-success"
                              onClick={() => handleUpdateReviewStatus(rep.review._id, "VISIBLE")}
                            >
                              ✅ Approve & Keep Visible
                            </button>
                            <button
                              className="admin-btn admin-btn-secondary"
                              onClick={() => handleUpdateReviewStatus(rep.review._id, "HIDDEN")}
                            >
                              🙈 Hide from Route
                            </button>
                            <button
                              className="admin-btn admin-btn-danger"
                              onClick={() => handleUpdateReviewStatus(rep.review._id, "REMOVED")}
                            >
                              ❌ Permanently Remove
                            </button>
                          </>
                        )}
                        <button
                          className="admin-btn admin-btn-secondary"
                          onClick={() => handleResolveReviewReport(rep._id, "RESOLVED")}
                        >
                          ✓ Dismiss / Resolve Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: COMMUNITY & FORUM MODERATION */}
          {activeTab === "community" && (
            <div>
              {/* Community Reports */}
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h2>Reported Community Posts ({communityReports.length})</h2>
                </div>
                {communityReports.length === 0 ? (
                  <div style={{ padding: "20px", color: "#64748b" }}>
                    No reported community posts currently pending review.
                  </div>
                ) : (
                  <div style={{ padding: "20px", display: "grid", gap: "12px" }}>
                    {communityReports.map((r) => (
                      <div
                        key={r._id}
                        style={{
                          padding: "15px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <strong>Reason: {r.reason}</strong>
                          <span className="status-badge pending">{r.status}</span>
                        </div>
                        {r.postId ? (
                          <div>
                            <h4>{r.postId.title}</h4>
                            <p style={{ fontSize: "14px", color: "#475569" }}>{r.postId.description}</p>
                            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                              <button
                                className="admin-btn admin-btn-secondary"
                                onClick={() => handleHidePost(r.postId._id)}
                              >
                                🙈 Hide Post
                              </button>
                              <button
                                className="admin-btn admin-btn-danger"
                                onClick={() => handleDeletePost(r.postId._id)}
                              >
                                ❌ Delete Post
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ color: "#ef4444" }}>Post already removed</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* All Community Posts */}
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h2>All Traveler Community Posts ({posts.length})</h2>
                </div>
                <div style={{ padding: "20px", display: "grid", gap: "16px" }}>
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      style={{
                        padding: "18px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h3 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>
                            {post.title}{" "}
                            {post.isPinned && (
                              <span style={{ color: "#d84e55", fontSize: "12px", fontWeight: "bold" }}>
                                📌 Pinned
                              </span>
                            )}
                          </h3>
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            By: {post.authorName} • Route: {post.route || "General"} → {post.destination || ""}
                          </span>
                        </div>
                        <span className={`status-badge ${(post.status || "active").toLowerCase()}`}>
                          {post.status || "active"}
                        </span>
                      </div>

                      <p style={{ margin: "10px 0", color: "#334155", fontSize: "14px" }}>
                        {post.description}
                      </p>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                        <button
                          className="admin-btn admin-btn-secondary"
                          onClick={() => handlePinPost(post._id)}
                        >
                          📌 {post.isPinned ? "Unpin Post" : "Pin Post"}
                        </button>
                        <button
                          className="admin-btn admin-btn-secondary"
                          onClick={() => handleHidePost(post._id)}
                        >
                          🙈 Hide / Show
                        </button>
                        <button
                          className="admin-btn admin-btn-danger"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          ❌ Delete Post
                        </button>
                      </div>

                      {/* Admin comment input */}
                      <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                        <input
                          type="text"
                          placeholder="Post official RedBus response comment..."
                          value={adminCommentText[post._id] || ""}
                          onChange={(e) =>
                            setAdminCommentText({ ...adminCommentText, [post._id]: e.target.value })
                          }
                          style={{
                            flex: 1,
                            padding: "6px 12px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "6px",
                            fontSize: "13px",
                          }}
                        />
                        <button
                          className="admin-btn admin-btn-primary"
                          onClick={() => handleAddAdminComment(post._id)}
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: NOTIFICATIONS & BROADCAST */}
          {activeTab === "notifications" && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h2>Traveler Notification & Broadcast Operations</h2>
                <div className="admin-panel-actions">
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={handleRetryFailedNotifications}
                  >
                    🔄 Retry Failed Deliveries
                  </button>
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => setShowBroadcastModal(true)}
                  >
                    📢 Broadcast Promotional Offer
                  </button>
                </div>
              </div>

              <div style={{ padding: "24px" }}>
                <h3>Notification System Health</h3>
                <p style={{ color: "#64748b", fontSize: "14px" }}>
                  Multi-channel delivery (In-App, Email, Push) is actively configured with automatic status
                  tracking and localized message dispatch in English and Hindi.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginTop: "20px",
                  }}
                >
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ fontSize: "13px", color: "#64748b" }}>Delivery Channels</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", marginTop: "6px", color: "#0f172a" }}>
                      In-App • Email • Push
                    </div>
                    <div style={{ fontSize: "12px", color: "#10b981", marginTop: "4px" }}>● All Operational</div>
                  </div>

                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ fontSize: "13px", color: "#64748b" }}>Retry Mechanism</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", marginTop: "6px", color: "#0f172a" }}>
                      Up to 3 Attempts
                    </div>
                    <div style={{ fontSize: "12px", color: "#3b82f6", marginTop: "4px" }}>Automatic Queue</div>
                  </div>

                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ fontSize: "13px", color: "#64748b" }}>Supported Languages</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", marginTop: "6px", color: "#0f172a" }}>
                      EN (English) & HI (हिन्दी)
                    </div>
                    <div style={{ fontSize: "12px", color: "#8b5cf6", marginTop: "4px" }}>Auto-localized</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: ADD NEW BUS */}
      {showAddBusModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Add New Bus to Fleet</h3>
              <button
                onClick={() => setShowAddBusModal(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateBus}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Operator Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VRL Travels, Zingbus, IntrCity"
                    value={busForm.operatorName}
                    onChange={(e) => setBusForm({ ...busForm, operatorName: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Bus Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH-01-AB-1234"
                    value={busForm.busNumber}
                    onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Bus Type</label>
                  <select
                    value={busForm.busType}
                    onChange={(e) => setBusForm({ ...busForm, busType: e.target.value })}
                  >
                    <option value="AC Sleeper (2+1)">AC Sleeper (2+1)</option>
                    <option value="Volvo Multi-Axle AC Semi-Sleeper">Volvo Multi-Axle AC Semi-Sleeper</option>
                    <option value="Bharat Benz AC Sleeper">Bharat Benz AC Sleeper</option>
                    <option value="Non-AC Seater (2+2)">Non-AC Seater (2+2)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Assign Route</label>
                  <select
                    required
                    value={busForm.routes}
                    onChange={(e) => setBusForm({ ...busForm, routes: e.target.value })}
                  >
                    <option value="">Select a travel corridor</option>
                    {routes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.departureLocation?.name} → {r.arrivalLocation?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div className="admin-form-group">
                    <label>Fare per Seat (₹)</label>
                    <input
                      type="number"
                      required
                      value={busForm.fare}
                      onChange={(e) => setBusForm({ ...busForm, fare: Number(e.target.value) })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Total Seats</label>
                    <input
                      type="number"
                      required
                      value={busForm.totalSeats}
                      onChange={(e) => setBusForm({ ...busForm, totalSeats: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Departure Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 21:00 or 06:30"
                    value={busForm.departureTime}
                    onChange={(e) => setBusForm({ ...busForm, departureTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddBusModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Save & Deploy Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW ROUTE */}
      {showAddRouteModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Configure New Bus Route</h3>
              <button
                onClick={() => setShowAddRouteModal(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateRoute}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Departure Location (Origin City)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Delhi, Bangalore"
                    value={routeForm.departureLocation}
                    onChange={(e) =>
                      setRouteForm({ ...routeForm, departureLocation: e.target.value })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Arrival Location (Destination City)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune, Jaipur, Hyderabad"
                    value={routeForm.arrivalLocation}
                    onChange={(e) =>
                      setRouteForm({ ...routeForm, arrivalLocation: e.target.value })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Estimated Travel Duration (in Minutes)</label>
                  <input
                    type="number"
                    required
                    value={routeForm.duration}
                    onChange={(e) =>
                      setRouteForm({ ...routeForm, duration: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddRouteModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Create Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST PROMOTION */}
      {showBroadcastModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Broadcast Promotional Notification</h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleBroadcastPromo}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={broadcastForm.coupon}
                    onChange={(e) =>
                      setBroadcastForm({ ...broadcastForm, coupon: e.target.value })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Promotional Offer Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. Get 20% discount on all sleeper buses this holiday season!"
                    value={broadcastForm.message}
                    onChange={(e) =>
                      setBroadcastForm({ ...broadcastForm, message: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowBroadcastModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
