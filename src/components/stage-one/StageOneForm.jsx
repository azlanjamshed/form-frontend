function StageOneForm({ heading, formData, handlers }) {
  const {
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
  } = formData;

  const {
    onNameChange,
    onMobileNumberChange,
    onSendOtp,
    onDemoCodeChange,
    onConsentChange,
    onSubmit,
  } = handlers;

  return (
    <section className="vf-landing-card">
      <h1 className="vf-landing-heading">{heading}</h1>

      <form className="vf-landing-form" onSubmit={onSubmit}>
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
            onChange={onNameChange}
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
              onChange={onMobileNumberChange}
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
              disabled={!/^[0-9]{10}$/.test(mobileNumber) || isOtpButtonClicked}
              onClick={onSendOtp}
            >
              {isOtpButtonClicked ? "OTP Requested ✓" : "Send OTP"}
            </button>
          </div>
        </div>

        {/* OTP field */}
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
              onChange={onDemoCodeChange}
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
              onChange={onConsentChange}
              required
            />

            <span>I consent to saving my name and mobile number.</span>
          </label>
        </div>

        {/* Autosave status */}
        {consent && hasEdited && isDraftReady && saveStatus !== "idle" && (
          <p
            className={`vf-landing-save-status vf-landing-save-status--${saveStatus}`}
            role="status"
          >
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "saved" && "Details saved"}
            {saveStatus === "error" && "Autosave failed. You can still submit."}
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
  );
}

export default StageOneForm;
