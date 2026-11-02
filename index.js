
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("hotelUser") || "null")
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.user) {
        throw new Error("User data not received from server");
      }

      localStorage.setItem("hotelUser", JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Backend start karein aur CORS check karein."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("hotelUser");
    setUser(null);
    setEmail("");
    setPassword("");
    setMessage("");
  }

  if (user) {
    return (
      <div className="dashboard">
        <header className="header">
          <h2>HotelPro</h2>
          <button onClick={handleLogout}>Logout</button>
        </header>

        <main className="welcome">
          <h1>Welcome, {user.name}!</h1>
          <p>You are successfully logged in.</p>

          <div className="dashboard-cards">
            <div className="card">
              <h3>Rooms</h3>
              <p>Manage hotel rooms</p>
            </div>

            <div className="card">
              <h3>Bookings</h3>
              <p>Manage reservations</p>
            </div>

            <div className="card">
              <h3>Profile</h3>
              <p>{user.email}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>HotelPro</h1>
        <p className="subtitle">Hotel Management System</p>

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

        {message && <p className="error">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
