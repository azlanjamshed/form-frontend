import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPublicPageConfig } from "../services/pageConfig.service.js";
import { saveDraft, completeStageOne } from "../services/submission.service.js";

import AppHeader from "../components/common/AppHeader.jsx";
import ProcessingScreen from "../components/common/ProcessingScreen.jsx";
import StageOneForm from "../components/stage-one/StageOneForm.jsx";
import StageOneCompleted from "../components/stage-one/StageOneCompleted.jsx";

import "../styles/pages/landing.css";

const DEFAULT_HEADING = "Welcome to";
const PROCESSING_DURATION = 3000;
const OTP_VISIBILITY_DELAY = 500;
const AUTOSAVE_DELAY = 700;

function LandingPage() {
  const navigate = useNavigate();

  // Page configuration
  const [heading, setHeading] = useState(DEFAULT_HEADING);

  // Form fields
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [demoCode, setDemoCode] = useState("");

  // OTP state
  const [isOtpButtonClicked, setIsOtpButtonClicked] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);

  // Consent
  const [consent, setConsent] = useState(true);

  // Form status
  const [hasEdited, setHasEdited] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Page flow
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Check whether the required details are valid.
  const isDraftReady =
    name.trim().length >= 2 && /^[0-9]{10}$/.test(mobileNumber);

  // Fetch administrator-configured heading.
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

  // Show OTP input 500ms after clicking Send OTP.
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

  // Show processing screen for 5 seconds.
  useEffect(() => {
    if (!isProcessing) return undefined;

    const timeoutId = window.setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, PROCESSING_DURATION);

    return () => window.clearTimeout(timeoutId);
  }, [isProcessing]);

  // Autosave only after consent and valid form details.
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
    }, AUTOSAVE_DELAY);

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

  // Form input handlers.
  const handleNameChange = (event) => {
    const value = event.target.value.replace(/[^a-zA-Z ]/g, "");

    setName(value);
    setHasEdited(true);
    setFormError("");
  };

  const handleMobileNumberChange = (event) => {
    setMobileNumber(event.target.value.replace(/\D/g, "").slice(0, 10));

    setIsOtpButtonClicked(false);
    setIsOtpVisible(false);
    setHasEdited(true);
    setFormError("");
  };

  const handleDemoCodeChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "").slice(0, 6);

    setDemoCode(numericValue);
  };

  const handleConsentChange = (event) => {
    setConsent(event.target.checked);
    setFormError("");
  };

  // Props for StageOneForm.
  const formData = {
    name,
    mobileNumber,
    isOtpButtonClicked,
    isOtpVisible,
    demoCode,
    consent,
    hasEdited,
    isDraftReady,
    saveStatus,
    formError,
    isSubmitting,
  };

  const formHandlers = {
    onNameChange: handleNameChange,
    onMobileNumberChange: handleMobileNumberChange,
    onSendOtp: () => setIsOtpButtonClicked(true),
    onDemoCodeChange: handleDemoCodeChange,
    onConsentChange: handleConsentChange,
    onSubmit: handleSubmit,
  };

  return (
    <div className="vf-landing-page">
      <AppHeader />

      <main className="vf-landing-main">
        {!isComplete && !isProcessing ? (
          <StageOneForm
            heading={heading}
            formData={formData}
            handlers={formHandlers}
          />
        ) : isProcessing ? (
          <ProcessingScreen />
        ) : (
          <StageOneCompleted onContinue={() => navigate("/stage-2")} />
        )}
      </main>
    </div>
  );
}

export default LandingPage;
