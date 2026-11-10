import { useEffect, useState } from "react";

import { getPublicPageConfig } from "../services/pageConfig.service.js";
import { completeStageTwo } from "../services/submission.service.js";

import "../styles/pages/landing.css";

const DEFAULT_HEADING = "Confirm your mobile number";

function StageTwoPage() {
  const [heading, setHeading] = useState(DEFAULT_HEADING);

  const [mobileNumber, setMobileNumber] = useState("");
  const [demoCode, setDemoCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [formError, setFormError] = useState("");

  // Fetch the Stage 2 heading configured by admin.
  useEffect(() => {
    const controller = new AbortController();

    getPublicPageConfig(controller.signal)
      .then((config) => {
        if (
          typeof config?.stageTwoHeading === "string" &&
          config.stageTwoHeading.trim()
        ) {
          setHeading(config.stageTwoHeading.trim());
        }
      })
      .catch(() => {
        // Use the default heading if fetching fails.
      });

    return () => controller.abort();
  }, []);

  // Handle Stage 2 submission.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Only mobile number is sent to the backend.
      // Demo code is never transmitted.
      await completeStageTwo({
        mobileNumber,
        stageTwoCode: demoCode,
      });

      setDemoCode("");
      setIsComplete(true);
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          "Unable to verify your details. Please try again.",
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
        {!isComplete ? (
          <section className="vf-landing-card">
            <h1 className="vf-landing-heading">{heading}</h1>

            <form className="vf-landing-form" onSubmit={handleSubmit}>
              {/* Mobile number */}
              <div className="vf-input-container vf-input-container--full-width">
                <label htmlFor="stage-two-mobile" className="vf-input-label">
                  Mobile Number
                  <span className="vf-input-required-indicator">*</span>
                </label>

                <input
                  id="stage-two-mobile"
                  type="tel"
                  className="vf-input vf-input--medium"
                  placeholder="Re-enter your 10-digit mobile number"
                  value={mobileNumber}
                  onChange={(event) => {
                    setMobileNumber(
                      event.target.value.replace(/\D/g, "").slice(0, 10),
                    );

                    setFormError("");
                  }}
                  inputMode="numeric"
                  autoComplete="tel-national"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>

              {/* Demo code */}
              <div className="vf-input-container vf-input-container--full-width">
                <label htmlFor="stage-two-demo-code" className="vf-input-label">
                  Enter OTP
                  <span className="vf-input-required-indicator">*</span>
                </label>

                <input
                  id="stage-two-demo-code"
                  type="text"
                  className="vf-input vf-input--medium"
                  placeholder="Enter any sample text"
                  value={demoCode}
                  onChange={(event) => {
                    setDemoCode(event.target.value);
                  }}
                  autoComplete="off"
                  required
                />

                {/* <span className="vf-input-helper">
                  Demo only. This value is never checked, saved or sent.
                </span> */}
              </div>

              {/* Error message */}
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
                  {isSubmitting ? "Checking..." : "Continue"}
                </span>
              </button>
            </form>
          </section>
        ) : (
          <section className="vf-landing-card vf-landing-success">
            <div className="vf-landing-success__icon">✓</div>

            <h1>Completed successfully</h1>

            <p>Your VerifyFlow demonstration is complete.</p>

            {/* <p className="vf-landing-success__note">
              No demo code was checked or transmitted.
            </p> */}
          </section>
        )}
      </main>
    </div>
  );
}

export default StageTwoPage;
