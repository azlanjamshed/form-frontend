import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api.js";
import { logoutUser } from "../../services/auth.service.js";

function CollectorChangePasswordPage() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword.length < 8 || newPassword.length > 128) {
      setError("New password must contain between 8 and 128 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setSuccess(response.data?.message || "Password changed successfully.");

      setTimeout(() => {
        navigate("/collector/dashboard", { replace: true });
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to change password.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      navigate("/collector/login", { replace: true });
    }
  }

  return (
    <div className="vf-collector-login">
      <main className="vf-collector-login__card">
        <h1>Change Your Password</h1>

        <p>
          Your temporary password must be replaced before you can access your
          collector dashboard.
        </p>

        {error && <p className="vf-admin-error">{error}</p>}
        {success && <p>{success}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="current-password">Temporary password</label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
          />

          <label htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Changing password..." : "Change Password"}
          </button>
        </form>

        <button type="button" onClick={handleLogout} disabled={loading}>
          Logout
        </button>
      </main>
    </div>
  );
}

export default CollectorChangePasswordPage;
