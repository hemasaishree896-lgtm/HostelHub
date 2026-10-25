import { Link } from "react-router-dom";

function Mess() {

  const menu = [
    {
      day: "Monday",
      breakfast: "Idli, Sambar & Chutney",
      lunch: "Rice, Dal, Vegetable Curry & Curd",
      snacks: "Tea & Biscuits",
      dinner: "Chapati, Paneer Curry & Rice"
    },

    {
      day: "Tuesday",
      breakfast: "Dosa, Sambar & Chutney",
      lunch: "Rice, Sambar, Beans Fry & Curd",
      snacks: "Tea & Samosa",
      dinner: "Rice, Chicken Curry & Salad"
    },

    {
      day: "Wednesday",
      breakfast: "Poori & Potato Curry",
      lunch: "Rice, Dal, Mixed Vegetable Curry & Curd",
      snacks: "Tea & Biscuits",
      dinner: "Chapati, Dal & Vegetable Curry"
    },

    {
      day: "Thursday",
      breakfast: "Upma, Chutney & Banana",
      lunch: "Rice, Rasam, Potato Fry & Curd",
      snacks: "Tea & Bajji",
      dinner: "Rice, Egg Curry & Salad"
    },

    {
      day: "Friday",
      breakfast: "Pongal & Sambar",
      lunch: "Rice, Dal, Cabbage Fry & Curd",
      snacks: "Tea & Biscuits",
      dinner: "Chapati, Paneer Curry & Rice"
    },

    {
      day: "Saturday",
      breakfast: "Vada, Sambar & Chutney",
      lunch: "Rice, Chicken Curry, Vegetable Fry & Curd",
      snacks: "Tea & Pakoda",
      dinner: "Rice, Dal & Vegetable Curry"
    },

    {
      day: "Sunday",
      breakfast: "Masala Dosa & Chutney",
      lunch: "Special Meals, Rice, Chicken Curry & Sweet",
      snacks: "Juice & Snacks",
      dinner: "Fried Rice & Manchurian"
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

          <Link
            to="/mess"
            className="active"
          >
            🍽️ Mess Menu
          </Link>

          <Link to="/notices">
            📢 Notices
          </Link>

        </nav>

      </aside>


      {/* Main Content */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <h1>
              Mess Menu
            </h1>

            <p>
              Check the weekly hostel food menu
            </p>

          </div>

          <div className="header-user">
            👤
          </div>

        </header>


        {/* Menu Introduction */}

        <section className="welcome-card">

          <div>

            <h2>
              🍽️ Weekly Mess Menu
            </h2>

            <p>
              Healthy and delicious meals are served throughout the week.
            </p>

          </div>

          <div className="welcome-icon">
            🍛
          </div>

        </section>


        {/* Weekly Menu */}

        <section className="menu-section">

          {menu.map((item) => (

            <div
              className="menu-day-card"
              key={item.day}
            >

              <div className="menu-day">

                <h2>
                  {item.day}
                </h2>

              </div>


              <div className="meal-grid">

                <div className="meal-card">

                  <div className="meal-icon">
                    🥣
                  </div>

                  <div>

                    <h3>
                      Breakfast
                    </h3>

                    <p>
                      {item.breakfast}
                    </p>

                  </div>

                </div>


                <div className="meal-card">

                  <div className="meal-icon">
                    🍛
                  </div>

                  <div>

                    <h3>
                      Lunch
                    </h3>

                    <p>
                      {item.lunch}
                    </p>

                  </div>

                </div>


                <div className="meal-card">

                  <div className="meal-icon">
                    ☕
                  </div>

                  <div>

                    <h3>
                      Snacks
                    </h3>

                    <p>
                      {item.snacks}
                    </p>

                  </div>

                </div>


                <div className="meal-card">

                  <div className="meal-icon">
                    🍽️
                  </div>

                  <div>

                    <h3>
                      Dinner
                    </h3>

                    <p>
                      {item.dinner}
                    </p>

                  </div>

                </div>

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

export default Mess;