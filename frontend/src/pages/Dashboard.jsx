
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("hostelUser") || "null"
  );

  const studentId = user
    ? String(user.id ?? user._id ?? "")
    : "";

  const roomNumber = user
    ? user.room || "A-101"
    : "A-101";

  const API_URL = "https://hostelhub6.onrender.com";

  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const noticesCount = 5;

  // Load complaints and leave requests from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!studentId) {
        setError("Please log in to view your dashboard.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [complaintsResponse, leavesResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/api/complaints?studentId=${encodeURIComponent(studentId)}`
            ),
            fetch(
              `${API_URL}/api/leaves?studentId=${encodeURIComponent(studentId)}`
            )
          ]);

        if (
          !complaintsResponse.ok ||
          !leavesResponse.ok
        ) {
          throw new Error(
            "Could not load dashboard information."
          );
        }

        const complaintsData =
          await complaintsResponse.json();

        const leavesData =
          await leavesResponse.json();

        setComplaints(
          Array.isArray(complaintsData)
            ? complaintsData.filter(
                (item) =>
                  String(item.studentId) === studentId
              )
            : []
        );

        setLeaves(
          Array.isArray(leavesData)
            ? leavesData.filter(
                (item) =>
                  String(item.studentId) === studentId
              )
            : []
        );
      } catch (err) {
        console.error("Dashboard loading error:", err);

        setError(
          "Unable to load complaints and leave requests. Please try refreshing the page."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [studentId]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("hostelUser");

    alert("Logged out successfully!");
    navigate("/login");
  };

  // Combine the latest complaints and leave requests
  const recentActivities = [
    ...complaints.map((complaint) => ({
      ...complaint,
      activityType: "complaint",
      activityDate:
        complaint.createdAt || complaint.date || "",
      activityId:
        complaint._id || complaint.id || complaint.title
    })),
    ...leaves.map((leave) => ({
      ...leave,
      activityType: "leave",
      activityDate:
        leave.createdAt || leave.date || "",
      activityId:
        leave._id || leave.id || leave.reason
    }))
  ].sort((a, b) => {
    const dateA = new Date(a.activityDate).getTime() || 0;
    const dateB = new Date(b.activityDate).getTime() || 0;

    return dateB - dateA;
  });

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString();
  };

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          🏠 HostelHub
        </div>

        <div className="user-info">
          <div className="user-avatar">👤</div>

          <h3>{user ? user.name : "Student"}</h3>

          <p>{user ? user.role : "Student"}</p>
        </div>

        <nav className="sidebar-menu">
          <Link to="/dashboard" className="active">
            🏠 Dashboard
          </Link>

          <Link to="/rooms">🛏️ My Room</Link>

          <Link to="/complaints">📝 Complaints</Link>

          <Link to="/leaves">📅 Leave Requests</Link>

          <Link to="/mess">🍽️ Mess Menu</Link>

          <Link to="/notices">📢 Notices</Link>

          <Link to="/profile">👤 Profile</Link>
        </nav>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back to HostelHub 👋</p>
          </div>

          <div className="header-user">👤</div>
        </header>

        {/* WELCOME CARD */}
        <section className="welcome-card">
          <div>
            <h2>
              Hello, {user ? user.name : "Student"}! 👋
            </h2>

            <p>
              Manage your hostel activities from one place.
            </p>
          </div>

          <div className="welcome-icon">🏠</div>
        </section>

        {/* STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">🛏️</div>

            <div>
              <h3>{roomNumber}</h3>
              <p>Room Number</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📝</div>

            <div>
              <h3>{loading ? "..." : complaints.length}</h3>
              <p>My Complaints</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>

            <div>
              <h3>{loading ? "..." : leaves.length}</h3>
              <p>My Leave Requests</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📢</div>

            <div>
              <h3>{noticesCount}</h3>
              <p>New Notices</p>
            </div>
          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>Quick Actions</h2>
            <p>Frequently used hostel services</p>
          </div>

          <div className="quick-grid">

            <Link to="/complaints" className="quick-card">
              <div className="quick-icon">📝</div>
              <h3>Submit Complaint</h3>
              <p>Report a hostel issue</p>
            </Link>

            <Link to="/leaves" className="quick-card">
              <div className="quick-icon">📅</div>
              <h3>Apply Leave</h3>
              <p>Submit a leave request</p>
            </Link>

            <Link to="/rooms" className="quick-card">
              <div className="quick-icon">🛏️</div>
              <h3>View Room</h3>
              <p>Check your room details</p>
            </Link>

            <Link to="/mess" className="quick-card">
              <div className="quick-icon">🍽️</div>
              <h3>View Mess Menu</h3>
              <p>Check today's menu</p>
            </Link>

          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>Recent Activity</h2>
            <p>Your latest hostel activities</p>
          </div>

          {error && (
            <p role="alert" style={{ color: "red" }}>
              {error}
            </p>
          )}

          {loading ? (
            <div className="empty-state">
              <p>Loading your recent activities...</p>
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="empty-state">
              <div>📋</div>

              <h3>No recent activity</h3>

              <p>
                Your submitted complaints and leave requests
                will appear here.
              </p>
            </div>
          ) : (
            <div className="activity-list">
              {recentActivities
                .slice(0, 6)
                .map((activity, index) => (
                  <div
                    className="activity-item"
                    key={
                      activity.activityType +
                      "-" +
                      activity.activityId +
                      "-" +
                      index
                    }
                  >
                    <div className="activity-icon">
                      {activity.activityType === "complaint"
                        ? "📝"
                        : "📅"}
                    </div>

                    <div>
                      <h4>
                        {activity.activityType === "complaint"
                          ? "Complaint Submitted"
                          : "Leave Request"}
                      </h4>

                      <p>
                        {activity.activityType === "complaint"
                          ? activity.title
                          : activity.reason}
                      </p>

                      {activity.activityType === "complaint" &&
                        activity.status && (
                          <p>Status: {activity.status}</p>
                        )}

                      {activity.activityType === "leave" &&
                        activity.status && (
                          <p>Status: {activity.status}</p>
                        )}
                    </div>

                    <span>
                      {formatDate(activity.activityDate)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
