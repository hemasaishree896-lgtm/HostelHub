import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">

      {/* Navigation Bar */}

      <nav className="navbar">

        <div className="logo">
          🏠 HostelHub
        </div>

        <div className="nav-links">

          <a href="#home">Home</a>

          <a href="#features">Features</a>

          <a href="#about">About</a>

          <Link to="/login">
            <button>Login</button>
          </Link>

        </div>

      </nav>


      {/* Hero Section */}

      <section className="hero" id="home">

        <div className="hero-content">

          <h1>
            Smart Hostel
            <br />
            Management System
          </h1>

          <p>
            Manage rooms, complaints, leave requests,
            mess and hostel notices in one simple platform.
          </p>

          <div className="hero-buttons">

            <Link to="/register">
              <button className="primary-btn">
                Get Started
              </button>
            </Link>

            <a href="#features">
              <button className="secondary-btn">
                Explore Features
              </button>
            </a>

          </div>

        </div>


        {/* HostelHub Card */}

        <div className="hero-card">

          <div className="card-icon">
            🏠
          </div>

          <h2>HostelHub</h2>

          <p>
            Everything your hostel needs in one place.
          </p>

          <div className="mini-stats">

            <div>
              <h3>120+</h3>
              <span>Students</span>
            </div>

            <div>
              <h3>50+</h3>
              <span>Rooms</span>
            </div>

            <div>
              <h3>24/7</h3>
              <span>Support</span>
            </div>

          </div>

        </div>

      </section>


      {/* Features */}

      <section className="features" id="features">

        <h2>
          Everything in One Place
        </h2>

        <p className="section-text">
          HostelHub makes hostel management simple and organized.
        </p>


        <div className="feature-grid">

          <div className="feature-card">

            <div>🛏️</div>

            <h3>
              Room Management
            </h3>

            <p>
              Check room availability and manage room allocation.
            </p>

          </div>


          <div className="feature-card">

            <div>📝</div>

            <h3>
              Complaints
            </h3>

            <p>
              Students can submit and track hostel complaints.
            </p>

          </div>


          <div className="feature-card">

            <div>📅</div>

            <h3>
              Leave Requests
            </h3>

            <p>
              Apply for leave and track approval status.
            </p>

          </div>


          <div className="feature-card">

            <div>🍽️</div>

            <h3>
              Mess Management
            </h3>

            <p>
              View daily mess menus and food information.
            </p>

          </div>


          <div className="feature-card">

            <div>📢</div>

            <h3>
              Notices
            </h3>

            <p>
              Stay updated with important hostel announcements.
            </p>

          </div>


          <div className="feature-card">

            <div>📊</div>

            <h3>
              Dashboard
            </h3>

            <p>
              View important hostel information at a glance.
            </p>

          </div>

        </div>

      </section>


      {/* About */}

      <section className="about" id="about">

        <h2>
          About HostelHub
        </h2>

        <p>
          HostelHub is a smart digital platform designed
          to simplify hostel management for students,
          wardens and administrators.
        </p>

      </section>


      {/* Footer */}

      <footer>

        <h3>
          🏠 HostelHub
        </h3>

        <p>
          Smart Hostel Management System
        </p>

        <p>
          © 2026 HostelHub
        </p>

      </footer>

    </div>
  );
}

export default Home;