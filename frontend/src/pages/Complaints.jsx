
import { useEffect, useState } from "react";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Room");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("hostelUser") || "{}");
  const studentId = user._id || user.id || user.studentId || "";
  const studentName = user.name || user.username || "";

  useEffect(() => {
    loadComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadComplaints() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/complaints?studentId=" + encodeURIComponent(studentId)
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load complaints.");
      }

      setComplaints(Array.isArray(data) ? data : data.complaints || []);
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
      setError("Please log in again before submitting a complaint.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError("Please enter a title and description.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          studentId,
          studentName,
          status: "Pending",
          date: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not submit the complaint.");
      }

      setTitle("");
      setCategory("Room");
      setDescription("");
      setMessage("Complaint submitted successfully!");

      await loadComplaints();
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
          <h1>Complaints</h1>
          <p>Submit and track your hostel complaints.</p>
        </header>

        <section className="form-card">
          <h2>Submit a Complaint</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="complaint-title">Complaint Title</label>
            <input
              id="complaint-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter complaint title"
              required
            />

            <label htmlFor="complaint-category">Category</label>
            <select
              id="complaint-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="Room">Room</option>
              <option value="Food">Food</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="complaint-description">Description</label>
            <textarea
              id="complaint-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Explain your complaint"
              rows="4"
              required
            />

            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </section>

        <section className="complaints-list">
          <h2>My Complaints</h2>

          {loading ? (
            <p>Loading complaints...</p>
          ) : complaints.length === 0 ? (
            <p>No complaints submitted yet.</p>
          ) : (
            complaints.map((complaint) => (
              <article
                className="complaint-card"
                key={complaint._id || complaint.id}
              >
                <h3>{complaint.title || "Complaint"}</h3>
                <p>
                  <strong>Category:</strong> {complaint.category || "Other"}
                </p>
                <p>{complaint.description}</p>
                <p>
                  <strong>Status:</strong> {complaint.status || "Pending"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {complaint.date
                    ? new Date(complaint.date).toLocaleDateString()
                    : "Not available"}
                </p>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Complaints;
