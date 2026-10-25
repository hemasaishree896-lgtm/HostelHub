
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Leaves() {
  const user = JSON.parse(
    localStorage.getItem("hostelUser") || "null"
  );

  const studentId = user
    ? String(user.id ?? user._id ?? "")
    : "";

  const [leaves, setLeaves] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load leave requests from MongoDB
  useEffect(() => {
    const fetchLeaves = async () => {
      if (!studentId) {
        setError("Please log in to view your leave requests.");
        setLoading(false);
        return;
      }

      try {
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/leaves?studentId=${encodeURIComponent(studentId)}`
        );

        if (!response.ok) {
          throw new Error("Could not load leave requests.");
        }

        const data = await response.json();
        setLeaves(data);
      } catch (err) {
        setError(
          "Unable to load leave requests. Please check your backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [studentId]);

  // Submit leave request to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId) {
      alert("Please log in before applying for leave.");
      return;
    }

    if (fromDate > toDate) {
      setError("The end date cannot be before the start date.");
      return;
    }

    setSubmitting(true);
    setError("");

    const newLeave = {
      studentId,
      studentName: user.name || "Student",
      studentEmail: user.email || "",
      fromDate,
      toDate,
      reason: reason.trim()
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/leaves",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newLeave)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit leave request."
        );
      }

      setLeaves((previous) => [...previous, data]);

      setFromDate("");
      setToDate("");
      setReason("");

      alert("Leave request submitted successfully!");
    } catch (err) {
      setError(
        err.message || "Unable to submit leave request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Show only the current student's leave requests
  const myLeaves = leaves.filter(
    (leave) => String(leave.studentId) === studentId
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
          <Link to="/dashboard">
            🏠 Dashboard
          </Link>

          <Link to="/rooms">
            🛏️ My Room
          </Link>

          <Link to="/complaints">
            📝 Complaints
          </Link>

          <Link to="/leaves" className="active">
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

        <Link to="/dashboard" className="back-dashboard">
          ← Dashboard
        </Link>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <h1>Leave Requests</h1>

            <p>
              Apply for leave and track your requests
            </p>
          </div>

          <div className="header-user">👤</div>
        </header>

        {/* LEAVE FORM */}
        <section className="leave-form-card">
          <div className="section-heading">
            <h2>📅 Apply for Leave</h2>

            <p>
              Submit your leave request to the warden
            </p>
          </div>

          <form
            className="leave-form"
            onSubmit={handleSubmit}
          >
            <div className="date-grid">
              <div>
                <label>From Date</label>

                <input
                  type="date"
                  value={fromDate}
                  min={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setFromDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>To Date</label>

                <input
                  type="date"
                  value={toDate}
                  min={fromDate || new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setToDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <label>Reason for Leave</label>

            <textarea
              placeholder="Example: Going home for a family function"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
                : "Submit Leave Request"}
            </button>
          </form>
        </section>

        {/* MY LEAVE REQUESTS */}
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>📋 My Leave Requests</h2>

            <p>
              Track the leave requests you submitted
            </p>
          </div>

          {error && (
            <p role="alert" style={{ color: "red" }}>
              {error}
            </p>
          )}

          {loading ? (
            <div className="empty-state">
              <p>Loading leave requests...</p>
            </div>
          ) : myLeaves.length === 0 ? (
            <div className="empty-state">
              <div>📅</div>

              <h3>No leave requests yet</h3>

              <p>
                Your submitted leave requests will appear here.
              </p>
            </div>
          ) : (
            <div className="leave-list">
              {myLeaves
                .slice()
                .reverse()
                .map((leave) => (
                  <div
                    className="leave-card"
                    key={leave._id || leave.id}
                  >
                    <div className="leave-top">
                      <div>
                        <h3>Leave Request</h3>

                        <p>
                          <strong>From:</strong>{" "}
                          {leave.fromDate}
                        </p>

                        <p>
                          <strong>To:</strong>{" "}
                          {leave.toDate}
                        </p>
                      </div>

                      <span className="leave-status">
                        {leave.status}
                      </span>
                    </div>

                    <div className="leave-reason">
                      <strong>Reason:</strong>

                      <p>{leave.reason}</p>
                    </div>

                    <p className="leave-date">
                      Applied on{" "}
                      {leave.date ||
                        (leave.createdAt
                          ? new Date(
                              leave.createdAt
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

export default Leaves;
