import { Link } from "react-router-dom";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("hostelUser") || "null"
  );

  const roomNumber = user
    ? user.room || "A-101"
    : "A-101";

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

          <Link to="/dashboard">
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

          <Link
            to="/profile"
            className="active"
          >
            👤 Profile
          </Link>

        </nav>

      </aside>


      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <h1>
              My Profile
            </h1>

            <p>
              View your HostelHub account details
            </p>

          </div>

          <div className="header-user">
            👤
          </div>

        </header>


        {/* PROFILE CARD */}

        <section className="profile-card">

          <div className="profile-avatar">
            👤
          </div>

          <h2>
            {user ? user.name : "Student"}
          </h2>

          <p className="profile-role">
            {user ? user.role : "Student"}
          </p>


          <div className="profile-details">

            {/* NAME */}

            <div className="profile-detail">

              <span>
                👤
              </span>

              <div>

                <small>
                  Full Name
                </small>

                <p>
                  {user
                    ? user.name
                    : "Not available"}
                </p>

              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-detail">

              <span>
                📧
              </span>

              <div>

                <small>
                  Email
                </small>

                <p>
                  {user
                    ? user.email
                    : "Not available"}
                </p>

              </div>

            </div>


            {/* ROLE */}

            <div className="profile-detail">

              <span>
                🎓
              </span>

              <div>

                <small>
                  Role
                </small>

                <p>
                  {user
                    ? user.role
                    : "Student"}
                </p>

              </div>

            </div>


            {/* ROOM */}

            <div className="profile-detail">

              <span>
                🛏️
              </span>

              <div>

                <small>
                  Room Number
                </small>

                <p>
                  {roomNumber}
                </p>

              </div>

            </div>

          </div>


          <Link
            to="/dashboard"
            className="back-dashboard"
          >
            ← Back to Dashboard
          </Link>

        </section>

      </main>

    </div>
  );
}

export default Profile;