
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPublicPageConfig } from "../services/pageConfig.service.js";
import {
  saveDraft,
  completeStageOne,
} from "../services/submission.service.js";

import "../styles/pages/landing.css";

const DEFAULT_HEADING = "Enter your details";

function LandingPage() {
  const navigate = useNavigate();

  const [heading, setHeading] = useState(DEFAULT_HEADING);

  // Form fields
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [demoCode, setDemoCode] = useState("");

  // Consent
  const [consent, setConsent] = useState(false);

  // Form state
  const [hasEdited, setHasEdited] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [formError, setFormError] = useState("");

  // Check whether the required details are valid.
  const isDraftReady =
    name.trim().length >= 2 &&
    /^[0-9]{10}$/.test(mobileNumber);

  // Fetch the heading configured by the administrator.
  useEffect(() => {
    const controller = new AbortController();

    getPublicPageConfig(controller.signal)
      .then((config) => {
        if (
          typeof config?.heading === "string" &&
          config.heading.trim()
        ) {
          setHeading(config.heading.trim());
        }
      })
      .catch(() => {
        // Keep the default heading if the API is unavailable.
      });

    return () => controller.abort();
  }, []);

  // Autosave only after consent is given.
  useEffect(() => {
    if (
      !consent ||
      !hasEdited ||
      !isDraftReady ||
      isComplete ||
      isSubmitting
    ) {
      setSaveStatus("idle");
      return undefined;
    }

    const controller = new AbortController();

    setSaveStatus("idle");

    const timeoutId = window.setTimeout(async () => {
      setSaveStatus("saving");

      try {
        await saveDraft(
          {
            name: name.trim(),
            mobileNumber,
            consentGiven: true,
          },
          controller.signal
        );

        if (!controller.signal.aborted) {
          setSaveStatus("saved");
        }
      } catch {
        if (!controller.signal.aborted) {
          setSaveStatus("error");
        }
      }
    }, 700);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [
    name,
    mobileNumber,
    consent,
    hasEdited,
    isDraftReady,
    isComplete,
    isSubmitting,
  ]);

  // Handle Stage 1 submission.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!consent) {
      setFormError(
        "Please provide consent before continuing."
      );
      return;
    }

    if (!isDraftReady) {
      setFormError(
        "Please enter a valid name and 10-digit mobile number."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Save details and consent before completing Stage 1.
      // This also handles submission before the autosave timer finishes.
      await saveDraft({
        name: name.trim(),
        mobileNumber,
        consentGiven: true,
      });

      // Demo code is intentionally excluded.
      await completeStageOne({
        name: name.trim(),
        mobileNumber,
      });

      setDemoCode("");
      navigate("/stage-2");
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          "Unable to submit your details. Please try again."
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

            <span className="vf-landing-brand__name">
              VerifyFlow
            </span>
          </a>
        </div>
      </header>

      <main className="vf-landing-main">
        {!isComplete ? (
          <section className="vf-landing-card">
            <h1 className="vf-landing-heading">
              {heading}
            </h1>

            <form
              className="vf-landing-form"
              onSubmit={handleSubmit}
            >
              {/* Full name */}
              <div className="vf-input-container vf-input-container--full-width">
                <label
                  htmlFor="full-name"
                  className="vf-input-label"
                >
                  Full Name
                  <span className="vf-input-required-indicator">
                    *
                  </span>
                </label>

                <input
                  id="full-name"
                  type="text"
                  className="vf-input vf-input--medium"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setHasEdited(true);
                    setFormError("");
                  }}
                  autoComplete="name"
                  minLength={2}
                  maxLength={80}
                  required
                />
              </div>

              {/* Mobile number */}
              <div className="vf-input-container vf-input-container--full-width">
                <label
                  htmlFor="mobile-number"
                  className="vf-input-label"
                >
                  Mobile Number
                  <span className="vf-input-required-indicator">
                    *
                  </span>
                </label>

                <input
                  id="mobile-number"
                  type="tel"
                  className="vf-input vf-input--medium"
                  placeholder="Enter 10-digit mobile number"
                  value={mobileNumber}
                  onChange={(event) => {
                    setMobileNumber(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10)
                    );

                    setHasEdited(true);
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
                <label
                  htmlFor="demo-code"
                  className="vf-input-label"
                >
                  Demo Code
                  <span className="vf-landing-optional">
                    Optional
                  </span>
                </label>

                <input
                  id="demo-code"
                  type="text"
                  className="vf-input vf-input--medium"
                  placeholder="Enter any sample text"
                  value={demoCode}
                  onChange={(event) => {
                    setDemoCode(event.target.value);
                  }}
                  autoComplete="off"
                />

                <span className="vf-input-helper">
                  Demo only. This value is never checked, saved or sent.
                </span>
              </div>

              {/* Consent */}
              <div className="vf-landing-consent">
                <label
                  htmlFor="consent"
                  className="vf-landing-consent__label"
                >
                  <input
                    id="consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => {
                      setConsent(event.target.checked);
                      setFormError("");
                    }}
                    required
                  />

                  <span>
                    I consent to saving my name and mobile number.
                  </span>
                </label>

                <p className="vf-landing-consent__note">
                  Unchecking consent stops future autosaves.
                  Previously saved details remain until an
                  administrator deletes them.
                </p>
              </div>

              {/* Autosave status */}
              {consent &&
                hasEdited &&
                isDraftReady &&
                saveStatus !== "idle" && (
                  <p
                    className={`vf-landing-save-status vf-landing-save-status--${saveStatus}`}
                    role="status"
                  >
                    {saveStatus === "saving" && "Saving..."}

                    {saveStatus === "saved" && "Details saved"}

                    {saveStatus === "error" &&
                      "Autosave failed. You can still submit."}
                  </p>
                )}

              {/* Form error */}
              {formError && (
                <p
                  className="vf-landing-error"
                  role="alert"
                >
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
                  <span
                    className="vf-button__spinner"
                    aria-hidden="true"
                  />
                )}

                <span className="vf-button__content">
                  {isSubmitting
                    ? "Submitting..."
                    : "Continue"}
                </span>
              </button>
            </form>
          </section>
        ) : (
          <section className="vf-landing-card vf-landing-success">
            <div className="vf-landing-success__icon">
              ✓
            </div>

            <h1>Details submitted</h1>

            <p>
              Your details have been submitted successfully.
            </p>

            <p className="vf-landing-success__note">
              The demo code was not checked, saved or transmitted.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default LandingPage;
