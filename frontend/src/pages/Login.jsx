
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid email or password.");
        return;
      }

      // Save the logged-in user
      localStorage.setItem(
        "hostelUser",
        JSON.stringify(data.user)
      );

      // Save the authentication token
      localStorage.setItem("hostelToken", data.token);

      localStorage.setItem("isLoggedIn", "true");

      alert("Login successful!");

      // Navigate based on the user's role
      if (data.user.role === "warden") {
        navigate("/warden-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(
        "Cannot connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>🏠 HostelHub</h1>

        <h2>Welcome Back</h2>

        <p>Login to your hostel account</p>

        <form onSubmit={handleLogin}>
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>

        <Link className="home-link" to="/">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Login;
