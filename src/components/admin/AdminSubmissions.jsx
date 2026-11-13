import "../../styles/components/admin-submissions.css";
function AdminSubmissions({
  submissions,
  loading,
  page,
  totalPages,
  searchInput,
  status,
  onSearch,
  onSearchInputChange,
  onStatusChange,
  onPreviousPage,
  onNextPage,
  onSharing,
  onDelete,
  onCopyShareLink,
}) {
  return (
    <section className="vf-admin-panel">
      <h3>Submissions</h3>

      {/* Search and filters */}
      <form className="vf-admin-filters" onSubmit={onSearch}>
        <input
          type="text"
          placeholder="Search by name or mobile number"
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
        />

        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
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
                <th>ToolPin</th>
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
                  <td>{submission.toolpin || "—"}</td>
                  <td>{submission.status.replaceAll("_", " ")}</td>

                  <td>{submission.shareEnabled ? "Enabled" : "Disabled"}</td>

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
                            onCopyShareLink(submission.publicShareId)
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
                          onSharing(submission._id, !submission.shareEnabled)
                        }
                      >
                        {submission.shareEnabled
                          ? "Disable sharing"
                          : "Enable sharing"}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(submission._id)}
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
          onClick={onPreviousPage}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages || loading}
          onClick={onNextPage}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default AdminSubmissions;
