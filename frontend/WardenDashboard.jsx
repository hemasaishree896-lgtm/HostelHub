
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function WardenDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);

  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [studentError, setStudentError] = useState("");
  const [removingStudentId, setRemovingStudentId] = useState("");

  // Load students from MongoDB
  const loadStudents = useCallback(async () => {
    try {
      setLoadingStudents(true);
      setStudentError("");

      const token = localStorage.getItem("hostelToken");

      if (!token) {
        throw new Error("Please log in again as the warden.");
      }

      const response = await fetch(`${API_URL}/auth/students`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load students."
        );
      }

      if (!Array.isArray(data)) {
        throw new Error("Unexpected student data received.");
      }

      setUsers(data);
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudentError(error.message);
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  // Load complaints, leaves, and students
  useEffect(() => {
    let cancelled = false;

    async function loadRequests() {
      try {
        setLoadingRequests(true);
        setRequestError("");

        const [complaintsResponse, leavesResponse] =
          await Promise.all([
            fetch(`${API_URL}/complaints`),
            fetch(`${API_URL}/leaves`)
          ]);

        if (!complaintsResponse.ok || !leavesResponse.ok) {
          throw new Error(
            "The backend could not load complaints or leave requests."
          );
        }

        const [complaintsData, leavesData] = await Promise.all([
          complaintsResponse.json(),
          leavesResponse.json()
        ]);

        if (
          !Array.isArray(complaintsData) ||
          !Array.isArray(leavesData)
        ) {
          throw new Error(
            "The backend returned an unexpected response."
          );
        }

        if (!cancelled) {
          setComplaints(complaintsData);
          setLeaves(leavesData);
        }
      } catch (error) {
        console.error("Failed to load requests:", error);

        if (!cancelled) {
          setRequestError(
            "Unable to load requests. Check that the backend is running."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingRequests(false);
        }
      }
    }

    loadRequests();
    loadStudents();

    return () => {
      cancelled = true;
    };
  }, [loadStudents]);

  // Remove a student from MongoDB
  const removeStudent = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${student.name} (${student.email}) from the hostel student list? This will permanently delete their account.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingStudentId(student._id);

      const token = localStorage.getItem("hostelToken");

      if (!token) {
        throw new Error("Please log in again as the warden.");
      }

      const response = await fetch(
        `${API_URL}/auth/students/${student._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to remove student."
        );
      }

      // Update the student table and count immediately
      setUsers((previous) =>
        previous.filter((user) => user._id !== student._id)
      );

      alert("Student removed successfully!");
    } catch (error) {
      console.error("Remove student failed:", error);
      alert(error.message);
    } finally {
      setRemovingStudentId("");
    }
  };

  // Update complaint status
  const updateComplaintStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_URL}/complaints/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Could not update complaint."
        );
      }

      setComplaints((previous) =>
        previous.map((item) =>
          item._id === result._id ? result : item
        )
      );
    } catch (error) {
      console.error("Complaint update failed:", error);
      alert(error.message);
    }
  };

  // Update leave status
  const updateLeaveStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_URL}/leaves/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Could not update leave request."
        );
      }

      setLeaves((previous) =>
        previous.map((item) =>
          item._id === result._id ? result : item
        )
      );
    } catch (error) {
      console.error("Leave update failed:", error);
      alert(error.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("hostelUser");
    localStorage.removeItem("hostelToken");

    alert("Logged out successfully!");
    navigate("/login");
  };

  const students = users.filter(
    (user) => user.role === "student"
  );

  const getDate = (item) => {
    if (item.date) return item.date;

    if (item.createdAt) {
      return new Date(item.createdAt).toLocaleDateString();
    }

    return "Date unavailable";
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-logo">🏠 HostelHub</div>

        <div className="user-info">
          <div className="user-avatar">👨‍💼</div>
          <h3>Warden</h3>
          <p>Hostel Administrator</p>
        </div>

        <nav className="sidebar-menu">
          <Link to="/warden-dashboard" className="active">
            🏠 Dashboard
          </Link>
          <Link to="/complaints">📝 Complaints</Link>
          <Link to="/leaves">📅 Leave Requests</Link>
          <Link to="/rooms">🛏️ Rooms</Link>
          <Link to="/notices">📢 Notices</Link>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Warden Dashboard</h1>
            <p>Manage hostel activities and student requests</p>
          </div>
          <div className="header-user">👨‍💼</div>
        </header>

        {loadingRequests && (
          <p>Loading complaints and leave requests...</p>
        )}

        {requestError && (
          <div className="empty-state">
            <p>{requestError}</p>
            <button onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        <section className="welcome-card">
          <div>
            <h2>Welcome, Warden 👋</h2>
            <p>
              Monitor students, complaints and leave requests.
            </p>
          </div>
          <div className="welcome-icon">🏠</div>
        </section>

        {/* Dashboard statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div>
              <h3>
                {loadingStudents ? "..." : studentError ? "—" : students.length}
              </h3>
              <p>Students</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div>
              <h3>{complaints.length}</h3>
              <p>Total Complaints</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div>
              <h3>
                {complaints.filter(
                  (item) => (item.status || "Pending") === "Pending"
                ).length}
              </h3>
              <p>Pending Complaints</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div>
              <h3>{leaves.length}</h3>
              <p>Leave Requests</p>
            </div>
          </div>
        </section>

        {/* Student Management */}
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>👥 Student Management</h2>
            <p>View and manage registered hostel students</p>
          </div>

          {loadingStudents ? (
            <div className="empty-state">
              <p>Loading registered students...</p>
            </div>
          ) : studentError ? (
            <div className="empty-state">
              <h3>Unable to load students</h3>
              <p>{studentError}</p>
              <button onClick={loadStudents}>Retry</button>
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <div>👥</div>
              <h3>No students registered</h3>
              <p>Registered students will appear here.</p>
            </div>
          ) : (
            <div className="student-table-container">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Room</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student._id}>
                      <td>{index + 1}</td>
                      <td>👤 {student.name}</td>
                      <td>{student.email}</td>
                      <td>
                        <span className="student-role">Student</span>
                      </td>
                      <td>🛏️ {student.room || "A-101"}</td>
                      <td>
                        <button
                          type="button"
                          disabled={removingStudentId === student._id}
                          onClick={() => removeStudent(student)}
                          style={{
                            backgroundColor: "#dc2626",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 12px",
                            cursor:
                              removingStudentId === student._id
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              removingStudentId === student._id
                                ? 0.6
                                : 1
                          }}
                        >
                          {removingStudentId === student._id
                            ? "Removing..."
                            : "🗑️ Remove"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Complaints */}
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>📝 Student Complaints</h2>
            <p>Review and update complaint status</p>
          </div>

          {complaints.length === 0 ? (
            <div className="empty-state">
              <div>📝</div>
              <h3>No complaints</h3>
              <p>There are currently no student complaints.</p>
            </div>
          ) : (
            <div className="warden-list">
              {complaints.map((complaint) => (
                <div className="warden-card" key={complaint._id}>
                  <div>
                    <h3>{complaint.title}</h3>
                    <span className="complaint-category">
                      {complaint.category}
                    </span>
                    <p>
                      👤 <strong>{complaint.studentName || "Student"}</strong>
                    </p>
                    <p>
                      📧 {complaint.studentEmail || "Email not available"}
                    </p>
                    <p>{complaint.description}</p>
                    <small>Submitted on {getDate(complaint)}</small>
                  </div>

                  <div className="warden-actions">
                    <span className="current-status">
                      {complaint.status || "Pending"}
                    </span>
                    <button
                      disabled={!complaint._id}
                      onClick={() =>
                        updateComplaintStatus(complaint._id, "In Progress")
                      }
                    >
                      🔧 In Progress
                    </button>
                    <button
                      disabled={!complaint._id}
                      onClick={() =>
                        updateComplaintStatus(complaint._id, "Resolved")
                      }
                    >
                      ✅ Resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Leave Requests */}
        <section className="dashboard-section">
          <div className="section-heading">
            <h2>📅 Student Leave Requests</h2>
            <p>Approve or reject student leave applications</p>
          </div>

          {leaves.length === 0 ? (
            <div className="empty-state">
              <div>📅</div>
              <h3>No leave requests</h3>
              <p>There are currently no leave requests.</p>
            </div>
          ) : (
            <div className="warden-list">
              {leaves.map((leave) => (
                <div className="warden-card" key={leave._id}>
                  <div>
                    <h3>Leave Request</h3>
                    <p>
                      👤 <strong>{leave.studentName || "Student"}</strong>
                    </p>
                    <p>
                      📧 {leave.studentEmail || "Email not available"}
                    </p>
                    <p>
                      <strong>From:</strong> {leave.fromDate}
                    </p>
                    <p>
                      <strong>To:</strong> {leave.toDate}
                    </p>
                    <p>
                      <strong>Reason:</strong> {leave.reason}
                    </p>
                    <small>Applied on {getDate(leave)}</small>
                  </div>

                  <div className="warden-actions">
                    <span className="current-status">
                      {leave.status || "Pending"}
                    </span>
                    <button
                      disabled={!leave._id}
                      onClick={() =>
                        updateLeaveStatus(leave._id, "Approved")
                      }
                    >
                      ✅ Approve
                    </button>
                    <button
                      disabled={!leave._id}
                      onClick={() =>
                        updateLeaveStatus(leave._id, "Rejected")
                      }
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default WardenDashboard;
