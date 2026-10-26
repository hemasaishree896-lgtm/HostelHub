
import { useEffect, useState } from "react";

function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [leaveType, setLeaveType] = useState("Home");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("hostelUser") || "{}");
  const studentId = user._id || user.id || user.studentId || "";
  const studentName = user.name || user.username || "";

  useEffect(() => {
    loadLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadLeaves() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/leaves?studentId=" + encodeURIComponent(studentId)
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load leave requests.");
      }

      setLeaves(Array.isArray(data) ? data : data.leaves || []);
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!studentId) {
      setError("Please log in again before applying for leave.");
      return;
    }

    if (!fromDate || !toDate || !reason.trim()) {
      setError("Please complete all the fields.");
      return;
    }

    if (toDate < fromDate) {
      setError("The return date cannot be before the starting date.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leaveType,
          fromDate,
          toDate,
          reason: reason.trim(),
          studentId,
          studentName,
          status: "Pending",
          date: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not submit the leave request.");
      }

      setLeaveType("Home");
      setFromDate("");
      setToDate("");
      setReason("");
      setMessage("Leave request submitted successfully!");

      await loadLeaves();
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <header className="page-header">
          <h1>Leave Applications</h1>
          <p>Apply for leave and check your application status.</p>
        </header>

        <section className="form-card">
          <h2>Apply for Leave</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="leave-type">Leave Type</label>
            <select
              id="leave-type"
              value={leaveType}
              onChange={(event) => setLeaveType(event.target.value)}
            >
              <option value="Home">Going Home</option>
              <option value="Personal">Personal</option>
              <option value="Medical">Medical</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="from-date">Starting Date</label>
            <input
              id="from-date"
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              required
            />

            <label htmlFor="to-date">Return Date</label>
            <input
              id="to-date"
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(event) => setToDate(event.target.value)}
              required
            />

            <label htmlFor="leave-reason">Reason for Leave</label>
            <textarea
              id="leave-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Enter your reason"
              rows="4"
              required
            />

            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Apply for Leave"}
            </button>
          </form>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </section>

        <section className="leaves-list">
          <h2>My Leave Applications</h2>

          {loading ? (
            <p>Loading leave applications...</p>
          ) : leaves.length === 0 ? (
            <p>No leave applications submitted yet.</p>
          ) : (
            leaves.map((leave) => (
              <article
                className="leave-card"
                key={leave._id || leave.id}
              >
                <h3>{leave.leaveType || "Leave Application"}</h3>
                <p>
                  <strong>Starting Date:</strong> {leave.fromDate || "—"}
                </p>
                <p>
                  <strong>Return Date:</strong> {leave.toDate || "—"}
                </p>
                <p>
                  <strong>Reason:</strong> {leave.reason || "—"}
                </p>
                <p>
                  <strong>Status:</strong> {leave.status || "Pending"}
                </p>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Leaves;
