import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("hostelUser") || "null"
  );

  const roomNumber = user
    ? user.room || "A-101"
    : "A-101";

  // Get all complaints
  const allComplaints = JSON.parse(
    localStorage.getItem("hostelComplaints") || "[]"
  );

  // Get all leave requests
  const allLeaves = JSON.parse(
    localStorage.getItem("hostelLeaves") || "[]"
  );

  // Show only current student's complaints
  const complaints = allComplaints.filter(
    (complaint) =>
      complaint.studentId ===
      (user ? user.id : null)
  );

  // Show only current student's leaves
  const leaves = allLeaves.filter(
    (leave) =>
      leave.studentId ===
      (user ? user.id : null)
  );

  const noticesCount = 5;

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("hostelUser");

    alert("Logged out successfully!");

    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          🏠 HostelHub
        </div>

        <div className="user-info">

          <div className="user-avatar">
            👤
          </div>

          <h3>
            {user ? user.name : "Student"}
          </h3>

          <p>
            {user ? user.role : "Student"}
          </p>

        </div>

        <nav className="sidebar-menu">

          <Link
            to="/dashboard"
            className="active"
          >
            🏠 Dashboard
          </Link>

          <Link to="/rooms">
            🛏️ My Room
          </Link>

          <Link to="/complaints">
            📝 Complaints
          </Link>

          <Link to="/leaves">
            📅 Leave Requests
          </Link>

          <Link to="/mess">
            🍽️ Mess Menu
          </Link>

          <Link to="/notices">
            📢 Notices
          </Link>

          <Link to="/profile">
            👤 Profile
          </Link>

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

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back to HostelHub 👋
            </p>

          </div>

          <div className="header-user">
            👤
          </div>

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

          <div className="welcome-icon">
            🏠
          </div>

        </section>


        {/* STATISTICS */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              🛏️
            </div>

            <div>

              <h3>
                {roomNumber}
              </h3>

              <p>
                Room Number
              </p>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📝
            </div>

            <div>

              <h3>
                {complaints.length}
              </h3>

              <p>
                My Complaints
              </p>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>

              <h3>
                {leaves.length}
              </h3>

              <p>
                My Leave Requests
              </p>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📢
            </div>

            <div>

              <h3>
                {noticesCount}
              </h3>

              <p>
                New Notices
              </p>

            </div>

          </div>

        </section>


        {/* QUICK ACTIONS */}

        <section className="dashboard-section">

          <div className="section-heading">

            <h2>
              Quick Actions
            </h2>

            <p>
              Frequently used hostel services
            </p>

          </div>


          <div className="quick-grid">

            <Link
              to="/complaints"
              className="quick-card"
            >

              <div className="quick-icon">
                📝
              </div>

              <h3>
                Submit Complaint
              </h3>

              <p>
                Report a hostel issue
              </p>

            </Link>


            <Link
              to="/leaves"
              className="quick-card"
            >

              <div className="quick-icon">
                📅
              </div>

              <h3>
                Apply Leave
              </h3>

              <p>
                Submit a leave request
              </p>

            </Link>


            <Link
              to="/rooms"
              className="quick-card"
            >

              <div className="quick-icon">
                🛏️
              </div>

              <h3>
                View Room
              </h3>

              <p>
                Check your room details
              </p>

            </Link>


            <Link
              to="/mess"
              className="quick-card"
            >

              <div className="quick-icon">
                🍽️
              </div>

              <h3>
                View Mess Menu
              </h3>

              <p>
                Check today's menu
              </p>

            </Link>

          </div>

        </section>


        {/* RECENT ACTIVITY */}

        <section className="dashboard-section">

          <div className="section-heading">

            <h2>
              Recent Activity
            </h2>

            <p>
              Your latest hostel activities
            </p>

          </div>


          {complaints.length === 0 &&
          leaves.length === 0 ? (

            <div className="empty-state">

              <div>
                📋
              </div>

              <h3>
                No recent activity
              </h3>

              <p>
                Your hostel activities will appear here.
              </p>

            </div>

          ) : (

            <div className="activity-list">

              {/* COMPLAINTS */}

              {complaints
                .slice()
                .reverse()
                .slice(0, 3)
                .map((complaint) => (

                  <div
                    className="activity-item"
                    key={"complaint-" + complaint.id}
                  >

                    <div className="activity-icon">
                      📝
                    </div>

                    <div>

                      <h4>
                        Complaint Submitted
                      </h4>

                      <p>
                        {complaint.title}
                      </p>

                    </div>

                    <span>
                      {complaint.date}
                    </span>

                  </div>

                ))}


              {/* LEAVE REQUESTS */}

              {leaves
                .slice()
                .reverse()
                .slice(0, 3)
                .map((leave) => (

                  <div
                    className="activity-item"
                    key={"leave-" + leave.id}
                  >

                    <div className="activity-icon">
                      📅
                    </div>

                    <div>

                      <h4>
                        Leave Request
                      </h4>

                      <p>
                        {leave.reason}
                      </p>

                    </div>

                    <span>
                      {leave.date}
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