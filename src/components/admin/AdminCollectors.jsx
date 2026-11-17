import { useEffect, useState } from "react";

import {
  createCollector,
  getCollectors,
  updateCollectorStatus,
  resetCollectorPassword,
} from "../../services/admin.service.js";

function formatLastLogin(value) {
  if (!value) return "Never";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Never";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function AdminCollectors() {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [passwordHeading, setPasswordHeading] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const [resettingId, setResettingId] = useState(null);

  async function fetchCollectors() {
    try {
      setLoading(true);
      setError("");

      const response = await getCollectors();
      const result = response?.data ?? response;

      setCollectors(result?.collectors ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load collectors.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCollectors();
  }, []);

  async function handleCreateCollector(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setNotice("");
      setTemporaryPassword("");

      const response = await createCollector({
        name: name.trim(),
        email: email.trim(),
      });

      const result = response?.data ?? response;

      setTemporaryPassword(result?.temporaryPassword || "");
      setPasswordHeading("Collector Account Created");

      setNotice("Collector created successfully.");
      setName("");
      setEmail("");

      await fetchCollectors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create collector.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(collector) {
    const nextStatus = !collector.isActive;

    try {
      setError("");
      setNotice("");

      await updateCollectorStatus(collector.id, nextStatus);

      setNotice(
        nextStatus
          ? "Collector activated successfully."
          : "Collector deactivated successfully.",
      );

      await fetchCollectors();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update collector status.",
      );
    }
  }

  async function handleResetPassword(collector) {
    const confirmed = window.confirm(
      `Reset password for ${collector.name} (${collector.email})? Their current password will stop working.`,
    );

    if (!confirmed) return;

    try {
      setResettingId(collector.id);
      setError("");
      setNotice("");
      setTemporaryPassword("");

      const response = await resetCollectorPassword(collector.id);
      const result = response?.data ?? response;

      setTemporaryPassword(result?.temporaryPassword || "");
      setPasswordHeading(`Password Reset: ${collector.name}`);
      setNotice("Collector password reset successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset collector password.",
      );
    } finally {
      setResettingId(null);
    }
  }

  async function handleCopyLink(formShareId) {
    const url = `${window.location.origin}/?collector=${formShareId}`;

    try {
      await navigator.clipboard.writeText(url);
      setNotice("Collector form link copied successfully.");
      setError("");
    } catch {
      setError("Unable to copy link.");
    }
  }

  async function handleCopyPassword() {
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setNotice("Temporary password copied.");
      setError("");
    } catch {
      setError("Unable to copy password.");
    }
  }

  function handleClosePassword() {
    setTemporaryPassword("");
    setPasswordHeading("");
  }

  return (
    <section className="vf-collectors">
      <div className="vf-collectors__heading">
        <h2>Collector Management</h2>
        <p>Create and manage collector accounts.</p>
      </div>

      {notice && <p className="vf-admin-notice">{notice}</p>}
      {error && <p className="vf-admin-error">{error}</p>}

      <div className="vf-collectors__create">
        <h3>Create New Collector</h3>

        <form onSubmit={handleCreateCollector}>
          <div>
            <label htmlFor="collector-name">Full name</label>
            <input
              id="collector-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter collector name"
              minLength={2}
              maxLength={80}
              required
            />
          </div>

          <div>
            <label htmlFor="collector-email">Email address</label>
            <input
              id="collector-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Collector"}
          </button>
        </form>
      </div>

      {temporaryPassword && (
        <div className="vf-collectors__password">
          <h3>{passwordHeading}</h3>
          <p>
            Share this temporary password securely with the collector. It will
            not be displayed again after closing this section.
          </p>

          <code>{temporaryPassword}</code>

          <div className="vf-collectors__actions">
            <button type="button" onClick={handleCopyPassword}>
              Copy Temporary Password
            </button>

            <button type="button" onClick={handleClosePassword}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="vf-collectors__list">
        <h3>All Collectors</h3>

        {loading ? (
          <p>Loading collectors...</p>
        ) : collectors.length === 0 ? (
          <p>No collectors found.</p>
        ) : (
          <div className="vf-collectors__table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Total Submissions</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {collectors.map((collector) => (
                  <tr key={collector.id}>
                    <td>{collector.name}</td>
                    <td>{collector.email}</td>
                    <td>{collector.isActive ? "Active" : "Inactive"}</td>
                    <td>{formatLastLogin(collector.lastLoginAt)}</td>
                    <td>{collector.totalSubmissions ?? 0}</td>
                    <td>
                      <div className="vf-collectors__actions">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(collector.formShareId)}
                          disabled={!collector.isActive}
                        >
                          Copy Form Link
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(collector)}
                        >
                          {collector.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResetPassword(collector)}
                          disabled={resettingId === collector.id}
                        >
                          {resettingId === collector.id
                            ? "Resetting..."
                            : "Reset Password"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminCollectors;
