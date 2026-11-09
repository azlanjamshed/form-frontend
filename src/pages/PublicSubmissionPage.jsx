import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/public-submission.css";
import { getPublicSharedSubmission } from "../services/submission.service.js";

function PublicSubmissionPage() {
  const { publicShareId } = useParams();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchSubmission() {
      try {
        setLoading(true);
        setError("");

        const response = await getPublicSharedSubmission(publicShareId);

        const result = response?.data?.data ?? response?.data ?? response;

        const data = result?.submission ?? result;

        if (isMounted) {
          setSubmission(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.status === 404
              ? "This shared submission is unavailable or sharing has been disabled."
              : err.response?.data?.message ||
                  "Unable to load this submission.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSubmission();

    return () => {
      isMounted = false;
    };
  }, [publicShareId]);

  function formatDate(date) {
    if (!date) return "Not available";

    return new Date(date).toLocaleString();
  }

  if (loading) {
    return (
      <main className="vf-share-page">
        <section className="vf-share-card">
          <p>Loading shared submission...</p>
        </section>
      </main>
    );
  }

  if (error || !submission) {
    return (
      <main className="vf-share-page">
        <section className="vf-share-card">
          <h1>Submission unavailable</h1>
          <p>{error || "This submission could not be found."}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="vf-share-page">
      <section className="vf-share-card">
        <header className="vf-share-header">
          <h1>VerifyFlow</h1>
          <p>Shared submission details</p>
        </header>

        <div className="vf-share-content">
          <h2>{submission.name}</h2>

          <div className="vf-share-status">
            {submission.status.replaceAll("_", " ")}
          </div>
          <div>
            <span>Mobile Number</span>
            <strong>{submission.mobileNumber || "Not available"}</strong>
          </div>

          <div className="vf-share-details">
            <div>
              <span>Submission date</span>
              <strong>{formatDate(submission.createdAt)}</strong>
            </div>

            <div>
              <span>Stage 1 completed</span>
              <strong>{formatDate(submission.stageOneCompletedAt)}</strong>
            </div>

            <div>
              <span>Stage 2 completed</span>
              <strong>{formatDate(submission.stageTwoCompletedAt)}</strong>
            </div>
          </div>
        </div>

        <footer className="vf-share-footer">
          <p>Shared through VerifyFlow.</p>
        </footer>
      </section>
    </main>
  );
}

export default PublicSubmissionPage;
