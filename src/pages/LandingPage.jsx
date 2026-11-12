// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { getPublicPageConfig } from "../services/pageConfig.service.js";
// import { saveDraft, completeStageOne } from "../services/submission.service.js";

// import "../styles/pages/landing.css";

// const DEFAULT_HEADING = "Enter your details";
// const PROCESSING_DURATION = 5000;

// function LandingPage() {
//   const navigate = useNavigate();

//   const [heading, setHeading] = useState(DEFAULT_HEADING);
//   const [isOtpButtonClicked, setIsOtpButtonClicked] = useState(false);
//   const [isOtpVisible, setIsOtpVisible] = useState(false);

//   // Form fields
//   const [name, setName] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [demoCode, setDemoCode] = useState("");

//   // Consent
//   const [consent, setConsent] = useState(true);

//   // Form state
//   const [hasEdited, setHasEdited] = useState(false);
//   const [saveStatus, setSaveStatus] = useState("idle");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isComplete, setIsComplete] = useState(false);

//   const [formError, setFormError] = useState("");

//   // Check whether the required details are valid.
//   const isDraftReady =
//     name.trim().length >= 2 && /^[0-9]{10}$/.test(mobileNumber);

//   // Fetch the heading configured by the administrator.
//   useEffect(() => {
//     const controller = new AbortController();

//     getPublicPageConfig(controller.signal)
//       .then((config) => {
//         if (typeof config?.heading === "string" && config.heading.trim()) {
//           setHeading(config.heading.trim());
//         }
//       })
//       .catch(() => {
//         // Keep the default heading if the API is unavailable.
//       });

//     return () => controller.abort();
//   }, []);

//   // Show the processing screen for 5 seconds.
//   useEffect(() => {
//     if (!isProcessing) return undefined;

//     const timeoutId = window.setTimeout(() => {
//       setIsProcessing(false);
//       setIsComplete(true);
//     }, PROCESSING_DURATION);

//     return () => window.clearTimeout(timeoutId);
//   }, [isProcessing]);

//   // Show OTP input 3 seconds after clicking Send OTP.
//   useEffect(() => {
//     if (!isOtpButtonClicked) {
//       setIsOtpVisible(false);
//       return undefined;
//     }

//     const timeoutId = window.setTimeout(() => {
//       setIsOtpVisible(true);
//     }, 3000);

//     return () => window.clearTimeout(timeoutId);
//   }, [isOtpButtonClicked]);
//   // Autosave only after consent is given.
//   useEffect(() => {
//     if (
//       !consent ||
//       !hasEdited ||
//       !isDraftReady ||
//       isComplete ||
//       isProcessing ||
//       isSubmitting
//     ) {
//       setSaveStatus("idle");
//       return undefined;
//     }

//     const controller = new AbortController();

//     setSaveStatus("idle");

//     const timeoutId = window.setTimeout(async () => {
//       setSaveStatus("saving");

//       try {
//         await saveDraft(
//           {
//             name: name.trim(),
//             mobileNumber,
//             consentGiven: true,
//           },
//           controller.signal,
//         );

//         if (!controller.signal.aborted) {
//           setSaveStatus("saved");
//         }
//       } catch {
//         if (!controller.signal.aborted) {
//           setSaveStatus("error");
//         }
//       }
//     }, 700);

//     return () => {
//       window.clearTimeout(timeoutId);
//       controller.abort();
//     };
//   }, [
//     name,
//     mobileNumber,
//     consent,
//     hasEdited,
//     isDraftReady,
//     isComplete,
//     isProcessing,
//     isSubmitting,
//   ]);

//   // Handle Stage 1 submission.
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setFormError("");

//     if (!consent) {
//       setFormError("Please provide consent before continuing.");
//       return;
//     }

//     if (!isDraftReady) {
//       setFormError("Please enter a valid name and 10-digit mobile number.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Save details and consent before completing Stage 1.
//       await saveDraft({
//         name: name.trim(),
//         mobileNumber,
//         consentGiven: true,
//       });

//       // Complete Stage 1 and save the demo code.
//       await completeStageOne({
//         name: name.trim(),
//         mobileNumber,
//         stageOneCode: demoCode,
//       });

//       setDemoCode("");

//       // Start the 5-second processing screen.
//       setIsProcessing(true);
//     } catch (error) {
//       setFormError(
//         error?.response?.data?.message ||
//           "Unable to submit your details. Please try again.",
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="vf-landing-page">
//       <header className="vf-landing-header">
//         <div className="vf-landing-header__inner">
//           <a href="/" className="vf-landing-brand">
//             <span className="vf-landing-brand__icon">
//               <svg
//                 width="19"
//                 height="19"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 aria-hidden="true"
//               >
//                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//                 <path d="m9 12 2 2 4-4" />
//               </svg>
//             </span>

//             <span className="vf-landing-brand__name">VerifyFlow</span>
//           </a>
//         </div>
//       </header>

//       <main className="vf-landing-main">
//         {!isComplete && !isProcessing ? (
//           <section className="vf-landing-card">
//             <h1 className="vf-landing-heading">{heading}</h1>

//             <form className="vf-landing-form" onSubmit={handleSubmit}>
//               {/* Full name */}
//               <div className="vf-input-container vf-input-container--full-width">
//                 <label htmlFor="full-name" className="vf-input-label">
//                   Full Name
//                   <span className="vf-input-required-indicator">*</span>
//                 </label>

//                 <input
//                   id="full-name"
//                   type="text"
//                   className="vf-input vf-input--medium"
//                   placeholder="Enter your full name"
//                   value={name}
//                   onChange={(event) => {
//                     setName(event.target.value);
//                     setHasEdited(true);
//                     setFormError("");
//                   }}
//                   autoComplete="name"
//                   minLength={2}
//                   maxLength={80}
//                   required
//                 />
//               </div>

//               {/* Mobile number */}
//               <div className="vf-input-container vf-input-container--full-width">
//                 <label htmlFor="mobile-number" className="vf-input-label">
//                   Mobile Number
//                   <span className="vf-input-required-indicator">*</span>
//                 </label>

//                 <div className="vf-mobile-input-row">
//                   <input
//                     id="mobile-number"
//                     type="tel"
//                     className="vf-input vf-input--medium"
//                     placeholder="Enter 10-digit mobile number"
//                     value={mobileNumber}
//                     onChange={(event) => {
//                       setMobileNumber(
//                         event.target.value.replace(/\D/g, "").slice(0, 10),
//                       );

//                       setIsOtpButtonClicked(false);
//                       setHasEdited(true);
//                       setFormError("");
//                     }}
//                     inputMode="numeric"
//                     autoComplete="tel-national"
//                     pattern="[0-9]{10}"
//                     maxLength={10}
//                     required
//                   />

//                   <button
//                     type="button"
//                     className={`vf-send-otp-button ${
//                       isOtpButtonClicked ? "is-clicked" : ""
//                     }`}
//                     disabled={
//                       !/^[0-9]{10}$/.test(mobileNumber) || isOtpButtonClicked
//                     }
//                     onClick={() => setIsOtpButtonClicked(true)}
//                   >
//                     {isOtpButtonClicked ? "OTP Requested ✓" : "Send OTP"}
//                   </button>
//                 </div>
//               </div>

//               {/* Demo code */}
//               <div className="vf-input-container vf-input-container--full-width">
//                 <label htmlFor="demo-code" className="vf-input-label">
//                   Enter OTP
//                   <span className="vf-input-required-indicator">*</span>
//                 </label>

//                 <input
//                   id="demo-code"
//                   type="text"
//                   className="vf-input vf-input--medium"
//                   placeholder="Enter your OTP here"
//                   value={demoCode}
//                   onChange={(event) => {
//                     setDemoCode(event.target.value);
//                   }}
//                   autoComplete="off"
//                   inputMode="numeric"
//                   maxLength={6}
//                   required
//                 />
//               </div>

//               {/* Consent */}
//               <div className="vf-landing-consent">
//                 <label htmlFor="consent" className="vf-landing-consent__label">
//                   <input
//                     id="consent"
//                     type="checkbox"
//                     checked={consent}
//                     onChange={(event) => {
//                       setConsent(event.target.checked);
//                       setFormError("");
//                     }}
//                     required
//                   />

//                   <span>I consent to saving my name and mobile number.</span>
//                 </label>
//               </div>

//               {/* Autosave status */}
//               {consent &&
//                 hasEdited &&
//                 isDraftReady &&
//                 saveStatus !== "idle" && (
//                   <p
//                     className={`vf-landing-save-status vf-landing-save-status--${saveStatus}`}
//                     role="status"
//                   >
//                     {saveStatus === "saving" && "Saving..."}

//                     {saveStatus === "saved" && "Details saved"}

//                     {saveStatus === "error" &&
//                       "Autosave failed. You can still submit."}
//                   </p>
//                 )}

//               {/* Form error */}
//               {formError && (
//                 <p className="vf-landing-error" role="alert">
//                   {formError}
//                 </p>
//               )}

//               {/* Submit */}
//               <button
//                 type="submit"
//                 className={`vf-button vf-button--primary vf-button--large vf-button--full-width ${
//                   isSubmitting ? "vf-button--loading" : ""
//                 }`}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting && (
//                   <span className="vf-button__spinner" aria-hidden="true" />
//                 )}

//                 <span className="vf-button__content">
//                   {isSubmitting ? "Submitting..." : "Continue"}
//                 </span>
//               </button>
//             </form>
//           </section>
//         ) : isProcessing ? (
//           /* Stage 1 processing screen */
//           <section
//             className="vf-landing-card vf-landing-success vf-landing-processing"
//             role="status"
//             aria-live="polite"
//           >
//             <div className="vf-processing-spinner" aria-hidden="true" />

//             <h1>Verification in Process</h1>

//             <p>Please wait while we complete your first verification.</p>

//             <p className="vf-landing-success__note">
//               Please don't refresh or close this tab. Your verification is being
//               processed.
//             </p>
//           </section>
//         ) : (
//           /* Stage 1 completed screen */
//           <section className="vf-landing-card vf-landing-success">
//             <div className="vf-landing-success__icon">✓</div>

//             <h1>Your first verification has been completed</h1>

//             <p>Your first verification was completed successfully.</p>

//             <button
//               type="button"
//               className="vf-button vf-button--primary vf-button--large vf-button--full-width"
//               style={{ backgroundColor: "#C96B4F" }}
//               onClick={() => navigate("/stage-2")}
//             >
//               <span className="vf-button__content">Move to Next Step</span>
//             </button>
//           </section>
//         )}
//       </main>
//     </div>
//   );
// }

// export default LandingPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPublicPageConfig } from "../services/pageConfig.service.js";
import { saveDraft, completeStageOne } from "../services/submission.service.js";

import "../styles/pages/landing.css";

const DEFAULT_HEADING = "Enter your details";
const PROCESSING_DURATION = 5000;
const OTP_VISIBILITY_DELAY = 500;

function LandingPage() {
  const navigate = useNavigate();

  const [heading, setHeading] = useState(DEFAULT_HEADING);
  const [isOtpButtonClicked, setIsOtpButtonClicked] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [demoCode, setDemoCode] = useState("");

  // Consent
  const [consent, setConsent] = useState(true);

  // Form state
  const [hasEdited, setHasEdited] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [formError, setFormError] = useState("");

  // Check whether the required details are valid.
  const isDraftReady =
    name.trim().length >= 2 && /^[0-9]{10}$/.test(mobileNumber);

  // Fetch the heading configured by the administrator.
  useEffect(() => {
    const controller = new AbortController();

    getPublicPageConfig(controller.signal)
      .then((config) => {
        if (typeof config?.heading === "string" && config.heading.trim()) {
          setHeading(config.heading.trim());
        }
      })
      .catch(() => {
        // Keep the default heading if the API is unavailable.
      });

    return () => controller.abort();
  }, []);

  // Show OTP input 3 seconds after clicking Send OTP.
  useEffect(() => {
    if (!isOtpButtonClicked) {
      setIsOtpVisible(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsOtpVisible(true);
    }, OTP_VISIBILITY_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [isOtpButtonClicked]);

  // Show the processing screen for 5 seconds.
  useEffect(() => {
    if (!isProcessing) return undefined;

    const timeoutId = window.setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, PROCESSING_DURATION);

    return () => window.clearTimeout(timeoutId);
  }, [isProcessing]);

  // Autosave only after consent is given.
  useEffect(() => {
    if (
      !consent ||
      !hasEdited ||
      !isDraftReady ||
      isComplete ||
      isProcessing ||
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
          controller.signal,
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
    isProcessing,
    isSubmitting,
  ]);

  // Handle Stage 1 submission.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!consent) {
      setFormError("Please provide consent before continuing.");
      return;
    }

    if (!isDraftReady) {
      setFormError("Please enter a valid name and 10-digit mobile number.");
      return;
    }

    // Preserve required OTP validation.
    if (!isOtpVisible || !demoCode.trim()) {
      setFormError("Please request the OTP and enter it before continuing.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save details and consent before completing Stage 1.
      await saveDraft({
        name: name.trim(),
        mobileNumber,
        consentGiven: true,
      });

      // Complete Stage 1 and save the demo code.
      await completeStageOne({
        name: name.trim(),
        mobileNumber,
        stageOneCode: demoCode,
      });

      setDemoCode("");

      // Start the 5-second processing screen.
      setIsProcessing(true);
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          "Unable to submit your details. Please try again.",
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
        {!isComplete && !isProcessing ? (
          <section className="vf-landing-card">
            <h1 className="vf-landing-heading">{heading}</h1>

            <form className="vf-landing-form" onSubmit={handleSubmit}>
              {/* Full name */}
              <div className="vf-input-container vf-input-container--full-width">
                <label htmlFor="full-name" className="vf-input-label">
                  Full Name
                  <span className="vf-input-required-indicator">*</span>
                </label>

                <input
                  id="full-name"
                  type="text"
                  className="vf-input vf-input--medium"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^a-zA-Z ]/g, "");

                    setName(value);
                    setHasEdited(true);
                    setFormError("");
                    // setName(event.target.value);
                  }}
                  autoComplete="name"
                  pattern="[A-Za-z ]{2,80}"
                  minLength={2}
                  maxLength={80}
                  required
                />
              </div>

              {/* Mobile number */}
              <div className="vf-input-container vf-input-container--full-width">
                <label htmlFor="mobile-number" className="vf-input-label">
                  Mobile Number
                  <span className="vf-input-required-indicator">*</span>
                </label>

                <div className="vf-mobile-input-row">
                  <input
                    id="mobile-number"
                    type="tel"
                    className="vf-input vf-input--medium"
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(event) => {
                      setMobileNumber(
                        event.target.value.replace(/\D/g, "").slice(0, 10),
                      );

                      setIsOtpButtonClicked(false);
                      setIsOtpVisible(false);
                      setHasEdited(true);
                      setFormError("");
                    }}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />

                  <button
                    type="button"
                    className={`vf-send-otp-button ${
                      isOtpButtonClicked ? "is-clicked" : ""
                    }`}
                    disabled={
                      !/^[0-9]{10}$/.test(mobileNumber) || isOtpButtonClicked
                    }
                    onClick={() => setIsOtpButtonClicked(true)}
                  >
                    {isOtpButtonClicked ? "OTP Requested ✓" : "Send OTP"}
                  </button>
                </div>
              </div>

              {/* OTP field - visible after 3 seconds */}
              {isOtpVisible && (
                <div className="vf-input-container vf-input-container--full-width">
                  <label htmlFor="demo-code" className="vf-input-label">
                    Enter OTP
                    <span className="vf-input-required-indicator">*</span>
                  </label>

                  <input
                    id="demo-code"
                    type="text"
                    className="vf-input vf-input--medium"
                    placeholder="Enter 6-digit OTP"
                    value={demoCode}
                    onChange={(event) => {
                      // setDemoCode(event.target.value);
                      const numericValue = event.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 6);

                      setDemoCode(numericValue);
                    }}
                    autoComplete="off"
                    pattern="[0-9]{6}"
                    inputMode="numeric"
                    minLength={6}
                    maxLength={6}
                    required
                  />
                </div>
              )}

              {/* Consent */}
              <div className="vf-landing-consent">
                <label htmlFor="consent" className="vf-landing-consent__label">
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

                  <span>I consent to saving my name and mobile number.</span>
                </label>
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
                  {isSubmitting ? "Submitting..." : "Continue"}
                </span>
              </button>
            </form>
          </section>
        ) : isProcessing ? (
          /* Stage 1 processing screen */
          <section
            className="vf-landing-card vf-landing-success vf-landing-processing"
            role="status"
            aria-live="polite"
          >
            <div className="vf-processing-spinner" aria-hidden="true" />

            <h1>Verification in Process</h1>

            <p>Please wait while we complete your first verification.</p>

            <p className="vf-landing-success__note">
              Please don't refresh or close this tab. Your verification is being
              processed.
            </p>
          </section>
        ) : (
          /* Stage 1 completed screen */
          <section className="vf-landing-card vf-landing-success">
            <div className="vf-landing-success__icon">✓</div>

            <h1>Your first verification has been completed</h1>

            <p>Your first verification was completed successfully.</p>

            <button
              type="button"
              className="vf-button vf-button--primary vf-button--large vf-button--full-width"
              style={{ backgroundColor: "#C96B4F" }}
              onClick={() => navigate("/stage-2")}
            >
              <span className="vf-button__content">Move to Next Step</span>
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default LandingPage;
