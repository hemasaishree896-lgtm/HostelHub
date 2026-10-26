import { Link } from "react-router-dom";

function Rooms() {

  // Get logged-in user

  const user = JSON.parse(
    localStorage.getItem("hostelUser") || "null"
  );


  // Get student's room

  const roomNumber = user
    ? user.room || "A-101"
    : "A-101";


  return (

    <div className="dashboard-page">


      {/* =========================
          SIDEBAR
      ========================= */}

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

          <Link
            to="/rooms"
            className="active"
          >
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

      </aside>



      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="dashboard-main">


        {/* Header */}

        <header className="dashboard-header">

          <div>

            <h1>
              My Room
            </h1>

            <p>
              View your hostel room details
            </p>

          </div>


          <div className="header-user">
            👤
          </div>

        </header>



        {/* =========================
            ROOM DETAILS
        ========================= */}

        <section className="room-details-card">


          {/* Room Header */}

          <div className="room-header">

            <div className="room-icon">
              🛏️
            </div>


            <div>

              <h2>
                Room {roomNumber}
              </h2>

              <p>
                Hostel Block
              </p>

            </div>


            <span className="room-status">
              Occupied
            </span>

          </div>



          {/* Room Information */}

          <div className="room-info-grid">


            <div className="room-info">

              <span>
                🏢
              </span>

              <div>

                <small>
                  Block
                </small>

                <p>
                  {roomNumber.startsWith("B")
                    ? "Block B"
                    : "Block A"}
                </p>

              </div>

            </div>



            <div className="room-info">

              <span>
                🏠
              </span>

              <div>

                <small>
                  Floor
                </small>

                <p>
                  1st Floor
                </p>

              </div>

            </div>



            <div className="room-info">

              <span>
                👥
              </span>

              <div>

                <small>
                  Sharing
                </small>

                <p>
                  2 Sharing
                </p>

              </div>

            </div>



            <div className="room-info">

              <span>
                🛏️
              </span>

              <div>

                <small>
                  Bed
                </small>

                <p>
                  Bed 1
                </p>

              </div>

            </div>

          </div>



          {/* Student */}

          <div className="room-student-section">

            <h3>
              👤 Student Details
            </h3>


            <div className="room-student">

              <div className="user-avatar">
                👤
              </div>


              <div>

                <h4>
                  {user ? user.name : "Student"}
                </h4>

                <p>
                  {user
                    ? user.email
                    : "student@example.com"}
                </p>

              </div>

            </div>

          </div>



          {/* Room Facilities */}

          <div className="room-facilities">

            <h3>
              🏠 Room Facilities
            </h3>


            <div className="facility-grid">


              <div className="facility-item">

                <span>
                  🛏️
                </span>

                <p>
                  Bed
                </p>

              </div>



              <div className="facility-item">

                <span>
                  📚
                </span>

                <p>
                  Study Table
                </p>

              </div>



              <div className="facility-item">

                <span>
                  🚿
                </span>

                <p>
                  Attached Bathroom
                </p>

              </div>



              <div className="facility-item">

                <span>
                  📶
                </span>

                <p>
                  Wi-Fi
                </p>

              </div>

            </div>

          </div>



          {/* Back Button */}

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

export default Rooms;
