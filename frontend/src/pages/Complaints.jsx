
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Complaints() {
  // Get logged-in user
  const user = JSON.parse(
    localStorage.getItem("hostelUser") || "null"
  );

  const studentId = user
    ? String(user.id ?? user._id ?? "")
    : "";

  // Deployed backend URL
  const API_URL = "https://hostelhub6.onrender.com";

  // Complaint data
  const [complaints, setComplaints] = useState([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Room");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load complaints from MongoDB through the deployed backend
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!studentId) {
        setError("Please log in to view your complaints.");
        setLoading(false);
        return;
      }

      try {
        setError("");

        const response = await fetch(
          `${API_URL}/api/complaints?studentId=${encodeURIComponent(studentId)}`
        );

        if (!response.ok) {
          throw new Error("Could not load complaints.");
        }

        const data = await response.json();

        setComplaints(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        setError(
          "Unable to load complaints. Please check your backend connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [studentId]);

  // Submit complaint to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId) {
      alert("Please log in before submitting a complaint.");
      return;
    }

    setSubmitting(true);
    setError("");

    const newComplaint = {
      studentId: studentId,
      studentName: user.name || "Student",
      studentEmail: user.email || "",
      title: title.trim(),
      category: category,
      description: description.trim()
    };

    try {
      const response = await fetch(
        `${API_URL}/api/complaints`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newComplaint)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit complaint."
        );
      }

      // Add the saved complaint to the page
      setComplaints((previous) => [
        ...previous,
        data
      ]);

      // Clear form
      setTitle("");
      setCategory("Room");
      setDescription("");

      alert("Complaint submitted successfully!");
    } catch (err) {
      setError(
        err.message || "Unable to submit complaint."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Show only this student's complaints
  const myComplaints = complaints.filter(
    (complaint) =>
      String(complaint.studentId) === studentId
  );

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
          <Link to="/dashboard">🏠 Dashboard</Link>

          <Link to="/rooms">🛏️ My Room</Link>

          <Link to="/complaints" className="active">
            📝 Complaints
          </Link>

          <Link to="/leaves">📅 Leave Requests</Link>

          <Link to="/mess">🍽️ Mess Menu</Link>

          <Link to="/notices">📢 Notices</Link>

          <Link to="/profile">👤 Profile</Link>
        </nav>

        <Link to="/dashboard" className="back-dashboard">
          ← Dashboard
        </Link>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <h1>Complaints</h1>

            <p>
              Report and track your hostel complaints
            </p>
          </div>

          <div className="header-user">👤</div>
        </header>

        {/* COMPLAINT FORM */}
        <section className="complaint-form-card">
          <div className="section-heading">
            <h2>📝 Submit a Complaint</h2>

            <p>Tell us about a hostel issue</p>
          </div>

          <form
            className="complaint-form"
            onSubmit={handleSubmit}
          >
            <label>Complaint Title</label>

            <input
              type="text"
              placeholder="Example: Room fan not working"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label>Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Room">Room</option>
              <option value="Food">Food</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Other">Other</option>
            </select>

            <label>Description</label>

            <textarea
              placeholder="Describe your problem..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              required
            />

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Complaint"}
            </button>
          </form>
        </section>

        {/* MY COMPLAINTS */}
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>📋 My Complaints</h2>

            <p>Track the complaints you submitted</p>
          </div>

          {error && (
            <p role="alert" style={{ color: "red" }}>
              {error}
            </p>
          )}

          {loading ? (
            <div className="empty-state">
              <p>Loading complaints...</p>
            </div>
          ) : myComplaints.length === 0 ? (
            <div className="empty-state">
              <div>📝</div>

              <h3>No complaints yet</h3>

              <p>
                Your submitted complaints will appear here.
              </p>
            </div>
          ) : (
            <div className="complaint-list">
              {myComplaints
                .slice()
                .reverse()
                .map((complaint) => (
                  <div
                    className="complaint-card"
                    key={complaint._id || complaint.id}
                  >
                    <div className="complaint-top">
                      <div>
                        <h3>{complaint.title}</h3>

                        <span className="complaint-category">
                          {complaint.category}
                        </span>
                      </div>

                      <span className="complaint-status">
                        {complaint.status}
                      </span>
                    </div>

                    <p className="complaint-description">
                      {complaint.description}
                    </p>

                    <p className="complaint-date">
                      Submitted on{" "}
                      {complaint.date ||
                        (complaint.createdAt
                          ? new Date(
                              complaint.createdAt
                            ).toLocaleDateString()
                          : "Date unavailable")}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Complaints;
