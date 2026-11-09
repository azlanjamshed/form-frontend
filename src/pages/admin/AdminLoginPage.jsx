import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginAdmin } from "../../services/auth.service.js";

import "../../styles/pages/landing.css";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");
    setIsSubmitting(true);

    try {
      await loginAdmin({
        email: email.trim(),
        password,
      });

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          "Unable to log in. Please check your credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vf-landing-page">
      <header className="vf-landing-header">
        <div className="vf-landing-header__inner">
          <a href="/" className="vf-landing-brand">
            <span className="vf-landing-brand__icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>

            <span className="vf-landing-brand__name">VerifyFlow</span>
          </a>
        </div>
      </header>

      <main className="vf-landing-main">
        <section className="vf-landing-card">
          <h1 className="vf-landing-heading">Admin Login</h1>

          <p>Sign in to manage VerifyFlow submissions and settings.</p>

          <form className="vf-landing-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="vf-input-container vf-input-container--full-width">
              <label htmlFor="admin-email" className="vf-input-label">
                Email Address
                <span className="vf-input-required-indicator">*</span>
              </label>

              <input
                id="admin-email"
                type="email"
                className="vf-input vf-input--medium"
                placeholder="Enter your admin email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFormError("");
                }}
                autoComplete="username"
                required
              />
            </div>

            {/* Password */}
            <div className="vf-input-container vf-input-container--full-width">
              <label htmlFor="admin-password" className="vf-input-label">
                Password
                <span className="vf-input-required-indicator">*</span>
              </label>

              <input
                id="admin-password"
                type="password"
                className="vf-input vf-input--medium"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFormError("");
                }}
                autoComplete="current-password"
                required
              />
            </div>

            {/* Error */}
            {formError && (
              <p className="vf-landing-error" role="alert">
                {formError}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`vf-button vf-button--primary vf-button--large vf-button--full-width ${
                isSubmitting ? "vf-button--loading" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <span className="vf-button__spinner" aria-hidden="true" />
              )}

              <span className="vf-button__content">
                {isSubmitting ? "Signing in..." : "Sign In"}
              </span>
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default AdminLoginPage;
