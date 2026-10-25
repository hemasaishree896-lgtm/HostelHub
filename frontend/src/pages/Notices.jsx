import { Link } from "react-router-dom";

function Notices() {

  const notices = [
    {
      id: 1,
      title: "Hostel Maintenance",
      category: "Maintenance",
      date: "04 Oct 2026",
      icon: "🔧",
      description:
        "Hostel maintenance work will be carried out on Sunday from 10:00 AM to 2:00 PM. Students are requested to cooperate."
    },

    {
      id: 2,
      title: "Monthly Hostel Meeting",
      category: "Important",
      date: "03 Oct 2026",
      icon: "📢",
      description:
        "A monthly hostel meeting will be conducted in the common hall. All students are requested to attend."
    },

    {
      id: 3,
      title: "Mess Timing Updated",
      category: "Mess",
      date: "02 Oct 2026",
      icon: "🍽️",
      description:
        "The dinner timing has been changed to 7:30 PM to 9:00 PM from Monday onwards."
    },

    {
      id: 4,
      title: "Hostel Fee Reminder",
      category: "Fees",
      date: "01 Oct 2026",
      icon: "💳",
      description:
        "Students who have pending hostel fees are requested to complete their payment before the due date."
    },

    {
      id: 5,
      title: "Sports Event",
      category: "Event",
      date: "30 Sep 2026",
      icon: "🏆",
      description:
        "The annual hostel sports event will be conducted next week. Interested students can register with the hostel office."
    }
  ];


  return (

    <div className="dashboard-page">

      {/* Sidebar */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          🏠 HostelHub
        </div>


        <div className="user-info">

          <div className="user-avatar">
            👤
          </div>

          <h3>
            Student
          </h3>

          <p>
            Student
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

          <Link
            to="/notices"
            className="active"
          >
            📢 Notices
          </Link>

        </nav>

      </aside>


      {/* Main Content */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <h1>
              Notices
            </h1>

            <p>
              Important hostel announcements and updates
            </p>

          </div>

          <div className="header-user">
            👤
          </div>

        </header>


        {/* Notice Summary */}

        <section className="welcome-card">

          <div>

            <h2>
              📢 Hostel Announcements
            </h2>

            <p>
              Stay updated with the latest hostel information.
            </p>

          </div>

          <div className="welcome-icon">
            📢
          </div>

        </section>


        {/* Notices */}

        <section className="notice-list">

          {notices.map((notice) => (

            <div
              className="notice-card"
              key={notice.id}
            >

              <div className="notice-icon">
                {notice.icon}
              </div>


              <div className="notice-content">

                <div className="notice-header">

                  <div>

                    <h2>
                      {notice.title}
                    </h2>

                    <span className="notice-category">
                      {notice.category}
                    </span>

                  </div>

                  <span className="notice-date">
                    {notice.date}
                  </span>

                </div>


                <p>
                  {notice.description}
                </p>

              </div>

            </div>

          ))}

        </section>


        <Link
          to="/dashboard"
          className="back-dashboard"
        >
          ← Back to Dashboard
        </Link>

      </main>

    </div>

  );

}

export default Notices;