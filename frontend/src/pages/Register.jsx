
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [room, setRoom] = useState("A-101");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Deployed backend URL
  const API_URL = "https://hostelhub6.onrender.com";

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            room: role === "student" ? room : "A-101",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert(
        "Cannot connect to the server. Please check your internet connection and backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>🏠 HostelHub</h1>

        <h2>Create Account</h2>

        <p>Register for HostelHub</p>

        <form onSubmit={handleRegister}>
          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <label>Role</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
          </select>

          {role === "student" && (
            <>
              <label>Room Number</label>

              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              >
                <option value="A-101">A-101</option>
                <option value="A-102">A-102</option>
                <option value="A-103">A-103</option>
                <option value="A-104">A-104</option>
                <option value="B-101">B-101</option>
                <option value="B-102">B-102</option>
                <option value="B-103">B-103</option>
                <option value="B-104">B-104</option>
              </select>
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

        <Link className="home-link" to="/">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Register;
