import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminPageConfig from "../../components/admin/AdminPageConfig.jsx";
import AdminSubmissions from "../../components/admin/AdminSubmissions.jsx";

import {
  getAdminSubmissions,
  deleteAdminSubmission,
  updateAdminSubmissionSharing,
} from "../../services/admin.service.js";

import { logoutAdmin } from "../../services/auth.service.js";

import "../../styles/admin.css";

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

  // Copy public sharing link
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

        {/* Public Form Configuration */}
        <AdminPageConfig />

        {/* Submissions */}
        <AdminSubmissions
          submissions={submissions}
          loading={loading}
          page={page}
          totalPages={totalPages}
          searchInput={searchInput}
          status={status}
          onSearch={handleSearch}
          onSearchInputChange={setSearchInput}
          onStatusChange={(nextStatus) => {
            setStatus(nextStatus);
            setPage(1);
          }}
          onPreviousPage={() => setPage((previous) => previous - 1)}
          onNextPage={() => setPage((previous) => previous + 1)}
          onSharing={handleSharing}
          onDelete={handleDelete}
          onCopyShareLink={handleCopyShareLink}
        />
      </main>
    </div>
  );
}

export default AdminDashboardPage;
