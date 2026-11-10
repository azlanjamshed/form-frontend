import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/admin.css";

import {
  getAdminSubmissions,
  deleteAdminSubmission,
  updateAdminSubmissionSharing,
} from "../../services/admin.service.js";

import { logoutAdmin } from "../../services/auth.service.js";

import {
  getPublicPageConfig,
  updatePageConfig,
} from "../../services/pageConfig.service.js";

function AdminDashboardPage() {
  const navigate = useNavigate();

  // Submission states
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({});

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  // Page configuration states
  const [pageConfig, setPageConfig] = useState({
    heading: "",
    stageTwoHeading: "",
  });

  const [configLoading, setConfigLoading] = useState(true);
  const [configSaving, setConfigSaving] = useState(false);
  const [configError, setConfigError] = useState("");
  const [configNotice, setConfigNotice] = useState("");

  // Fetch submissions
  useEffect(() => {
    let isMounted = true;

    async function fetchSubmissions() {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminSubmissions({
          page,
          limit: 10,
          search,
          status,
        });

        const result = response?.data?.data ?? response?.data ?? response;

        if (isMounted) {
          setSubmissions(result?.submissions ?? []);
          setPagination(result?.pagination ?? {});
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message || "Failed to load submissions.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSubmissions();

    return () => {
      isMounted = false;
    };
  }, [page, search, status, refreshKey]);

  // Fetch public page configuration
  useEffect(() => {
    let isMounted = true;

    async function fetchPageConfig() {
      try {
        setConfigLoading(true);
        setConfigError("");

        const response = await getPublicPageConfig();

        const config = response?.data?.data ?? response?.data ?? response;

        if (isMounted) {
          setPageConfig({
            heading: config?.heading || "",
            stageTwoHeading: config?.stageTwoHeading || "",
          });
        }
      } catch (err) {
        if (isMounted) {
          setConfigError(
            err.response?.data?.message || "Failed to load page configuration.",
          );
        }
      } finally {
        if (isMounted) {
          setConfigLoading(false);
        }
      }
    }

    fetchPageConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  // Search submissions
  function handleSearch(event) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  // Delete submission
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this submission?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setNotice("");

      await deleteAdminSubmission(id);

      setNotice("Submission deleted successfully.");

      setRefreshKey((previous) => previous + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete submission.");
    }
  }

  // Enable or disable public sharing
  async function handleSharing(id, enabled) {
    try {
      setError("");
      setNotice("");

      await updateAdminSubmissionSharing(id, enabled);

      setNotice(
        enabled ? "Public sharing enabled." : "Public sharing disabled.",
      );

      setRefreshKey((previous) => previous + 1);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update sharing settings.",
      );
    }
  }

  // Save public page headings
  async function handleSavePageConfig(event) {
    event.preventDefault();

    const heading = pageConfig.heading.trim();
    const stageTwoHeading = pageConfig.stageTwoHeading.trim();

    if (!heading || !stageTwoHeading) {
      setConfigError("Both headings are required.");
      return;
    }

    try {
      setConfigSaving(true);
      setConfigError("");
      setConfigNotice("");

      await updatePageConfig({
        heading,
        stageTwoHeading,
      });

      setPageConfig({
        heading,
        stageTwoHeading,
      });

      setConfigNotice("Public form headings updated successfully.");
    } catch (err) {
      setConfigError(
        err.response?.data?.message || "Failed to update page headings.",
      );
    } finally {
      setConfigSaving(false);
    }
  }

  async function handleCopyShareLink(publicShareId) {
    const shareUrl = `${window.location.origin}/user/${publicShareId}`;

    try {
      await navigator.clipboard.writeText(shareUrl);

      setNotice("Sharing link copied successfully!");
      setError("");
    } catch (err) {
      setError("Unable to copy link. Please open and copy it manually.");
    }
  }
  // Admin logout
  async function handleLogout() {
    try {
      await logoutAdmin();

      navigate("/admin/login", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Logout failed. Please try again.",
      );
    }
  }

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="vf-admin-page">
      {/* Header */}
      <header className="vf-admin-header">
        <h1>VerifyFlow Admin</h1>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="vf-admin-main">
        {/* Dashboard heading */}
        <section className="vf-admin-heading">
          <h2>Dashboard</h2>

          <p>Manage and review public submissions.</p>
        </section>

        {notice && <p className="vf-admin-notice">{notice}</p>}

        {error && <p className="vf-admin-error">{error}</p>}

        {/* Page configuration */}
        <section className="vf-admin-panel">
          <h3>Public Form Configuration</h3>

          <p>Manage the headings displayed on your public form.</p>

          {configError && <p className="vf-admin-error">{configError}</p>}

          {configNotice && <p className="vf-admin-notice">{configNotice}</p>}

          {configLoading ? (
            <p>Loading configuration...</p>
          ) : (
            <form className="vf-admin-filters" onSubmit={handleSavePageConfig}>
              <input
                type="text"
                placeholder="Stage 1 heading"
                maxLength={120}
                value={pageConfig.heading}
                onChange={(event) =>
                  setPageConfig((previous) => ({
                    ...previous,
                    heading: event.target.value,
                  }))
                }
              />

              <input
                type="text"
                placeholder="Stage 2 heading"
                maxLength={120}
                value={pageConfig.stageTwoHeading}
                onChange={(event) =>
                  setPageConfig((previous) => ({
                    ...previous,
                    stageTwoHeading: event.target.value,
                  }))
                }
              />

              <button type="submit" disabled={configSaving}>
                {configSaving ? "Saving..." : "Save Headings"}
              </button>
            </form>
          )}
        </section>

        {/* Submissions */}
        <section className="vf-admin-panel">
          <h3>Submissions</h3>

          {/* Search and filters */}
          <form className="vf-admin-filters" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by name or mobile number"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>

              <option value="DRAFT">Draft</option>

              <option value="STAGE_1_COMPLETED">Stage 1 completed</option>

              <option value="STAGE_2_COMPLETED">Stage 2 completed</option>
            </select>

            <button type="submit">Search</button>
          </form>

          {/* Submission table */}
          {loading ? (
            <p>Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <p>No submissions found.</p>
          ) : (
            <div className="vf-admin-table-wrapper">
              <table className="vf-admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Stage 1 Test Code</th>
                    <th>Stage 2 Test Code</th>
                    <th>Status</th>
                    <th>Sharing</th>
                    <th>Public Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission._id}>
                      <td>{submission.name}</td>

                      <td>{submission.mobileNumber}</td>

                      <td>{submission.stageOneCode || "—"}</td>

                      <td>{submission.stageTwoCode || "—"}</td>

                      <td>{submission.status.replaceAll("_", " ")}</td>

                      <td>
                        {submission.shareEnabled ? "Enabled" : "Disabled"}
                      </td>

                      <td>
                        {submission.shareEnabled ? (
                          <div className="vf-admin-actions">
                            <a
                              href={`${window.location.origin}/user/${submission.publicShareId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open Link
                            </a>

                            <button
                              type="button"
                              onClick={() =>
                                handleCopyShareLink(submission.publicShareId)
                              }
                            >
                              Copy Link
                            </button>
                          </div>
                        ) : (
                          "Not shared"
                        )}
                      </td>

                      <td>
                        <div className="vf-admin-actions">
                          <button
                            type="button"
                            disabled={submission.status !== "STAGE_2_COMPLETED"}
                            onClick={() =>
                              handleSharing(
                                submission._id,
                                !submission.shareEnabled,
                              )
                            }
                          >
                            {submission.shareEnabled
                              ? "Disable sharing"
                              : "Enable sharing"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(submission._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="vf-admin-pagination">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((previous) => previous - 1)}
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((previous) => previous + 1)}
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboardPage;
