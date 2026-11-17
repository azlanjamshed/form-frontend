import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/auth.service.js";

function CollectorLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginUser({
        email: email.trim(),
        password,
      });

      const user = response?.data?.user ?? response?.user;

      if (user?.role !== "staff") {
        setError("This account is not authorized as a collector.");
        return;
      }

      navigate(
        user.mustChangePassword
          ? "/collector/change-password"
          : "/collector/dashboard",
        { replace: true },
      );
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="vf-collector-login">
      <main className="vf-collector-login__card">
        <h1>Collector Login</h1>
        <p>Sign in to access your collection dashboard.</p>

        {error && <p className="vf-admin-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="collector-email">Email address</label>
          <input
            id="collector-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            autoComplete="username"
            required
          />

          <label htmlFor="collector-password">Password</label>
          <input
            id="collector-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CollectorLoginPage;
