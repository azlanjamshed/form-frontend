import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAdminSubmissions } from "../../services/admin.service.js";
import { getCurrentUser, logoutUser } from "../../services/auth.service.js";

const PAGE_LIMIT = 10;

const INITIAL_STATISTICS = {
  total: 0,
  draft: 0,
  stageOne: 0,
  stageTwo: 0,
};

function CollectorDashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [statistics, setStatistics] = useState(INITIAL_STATISTICS);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");

  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [userResponse, submissionResponse] = await Promise.all([
          getCurrentUser(),
          getAdminSubmissions({
            page: currentPage,
            limit: PAGE_LIMIT,
            search: searchInput,
            status,
          }),
        ]);

        if (!isMounted) return;

        const currentUser = userResponse?.data?.user ?? userResponse?.user;

        if (currentUser?.role !== "staff") {
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        const result =
          submissionResponse?.data?.data ??
          submissionResponse?.data ??
          submissionResponse;

        setUser(currentUser);
        setSubmissions(result?.submissions ?? []);
        setStatistics(result?.statistics ?? INITIAL_STATISTICS);
        setPagination(
          result?.pagination ?? {
            page: currentPage,
            limit: PAGE_LIMIT,
            total: 0,
            totalPages: 0,
          },
        );
      } catch (err) {
        if (!isMounted) return;

        setError(
          err.response?.data?.message || "Failed to load collector dashboard.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [navigate, currentPage, searchInput, status]);

  async function handleCopyFormLink() {
    if (!user?.formShareId) {
      setError("Your collector form link is unavailable.");
      return;
    }

    const formUrl = `${window.location.origin}/?collector=${user.formShareId}`;

    try {
      await navigator.clipboard.writeText(formUrl);
      setError("");
      setNotice("Your form link has been copied successfully!");
    } catch {
      setError("Unable to copy form link. Please copy it manually.");
      setNotice("");
    }
  }

  async function handleLogout() {
    try {
      await logoutUser();
      navigate("/collector/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed.");
    }
  }

  function handleSearchChange(event) {
    setSearchInput(event.target.value);
    setCurrentPage(1);
  }

  function handleStatusChange(event) {
    setStatus(event.target.value);
    setCurrentPage(1);
  }

  function handlePreviousPage() {
    setCurrentPage((previous) => Math.max(1, previous - 1));
  }

  function handleNextPage() {
    setCurrentPage((previous) => Math.min(pagination.totalPages, previous + 1));
  }

  return (
    <div className="vf-collector-dashboard">
      <header className="vf-collector-header">
        <div>
          <h1>VerifyFlow</h1>
          <p>Collector Dashboard</p>
        </div>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="vf-collector-main">
        <section className="vf-collector-welcome">
          <div>
            <h2>Welcome, {user?.name || "Collector"}</h2>
            <p>{user?.email}</p>
          </div>

          <button
            type="button"
            onClick={handleCopyFormLink}
            disabled={!user?.formShareId}
          >
            Copy Form Link
          </button>
        </section>
        {notice && <p className="vf-admin-notice">{notice}</p>}

        {error && <p className="vf-admin-error">{error}</p>}

        <section className="vf-collector-stats">
          <article>
            <span>Total Submissions</span>
            <strong>{statistics.total}</strong>
          </article>

          <article>
            <span>Draft</span>
            <strong>{statistics.draft}</strong>
          </article>

          <article>
            <span>Stage 1 Completed</span>
            <strong>{statistics.stageOne}</strong>
          </article>

          <article>
            <span>Stage 2 Completed</span>
            <strong>{statistics.stageTwo}</strong>
          </article>
        </section>

        <section className="vf-collector-submissions">
          <div className="vf-collector-submissions__heading">
            <h2>My Submissions</h2>
            <p>View and track the students you have collected.</p>
          </div>

          <div className="vf-collector-filters">
            <input
              type="search"
              placeholder="Search by name or mobile number"
              value={searchInput}
              onChange={handleSearchChange}
            />

            <select value={status} onChange={handleStatusChange}>
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="STAGE_1_COMPLETED">Stage 1 Completed</option>
              <option value="STAGE_2_COMPLETED">Stage 2 Completed</option>
            </select>
          </div>

          {loading ? (
            <p>Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <p>No submissions found.</p>
          ) : (
            <>
              <div className="vf-collector-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Mobile Number</th>
                      <th>Stage 1 OTP</th>
                      <th>Stage 2 OTP</th>
                      <th>ToolPin</th>
                      <th>Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {submissions.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name || "—"}</td>
                        <td>{item.mobileNumber || "—"}</td>
                        <td>{item.stageOneCode || "—"}</td>
                        <td>{item.stageTwoCode || "—"}</td>
                        <td>{item.toolpin || "—"}</td>
                        <td>{item.status?.replaceAll("_", " ") || "—"}</td>
                        <td>
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                "en-IN",
                              )
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="vf-collector-pagination">
                <p>
                  Showing {(pagination.page - 1) * pagination.limit + 1}
                  {" - "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}
                  {" of "}
                  {pagination.total} submissions
                </p>

                <div>
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1 || loading}
                  >
                    Previous
                  </button>

                  <span>
                    Page {pagination.page} of{" "}
                    {Math.max(1, pagination.totalPages)}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage >= pagination.totalPages || loading}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default CollectorDashboardPage;
