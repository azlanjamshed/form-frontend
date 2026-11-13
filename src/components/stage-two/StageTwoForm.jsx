function StageTwoForm({
  heading,
  mobileNumber,
  demoCode,
  isOtpRequesting,
  isOtpRequested,
  isOtpVisible,
  isSubmitting,
  formError,
  onMobileNumberChange,
  onDemoCodeChange,
  onRequestOtp,
  onSubmit,
}) {
  return (
    <section className="vf-landing-card">
      <h1 className="vf-landing-heading">{heading}</h1>

      <form className="vf-landing-form" onSubmit={onSubmit}>
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
              onChange={onMobileNumberChange}
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
              onClick={onRequestOtp}
            >
              {isOtpRequesting
                ? "Checking..."
                : isOtpRequested
                  ? "OTP Requested ✓"
                  : "Send OTP"}
            </button>
          </div>
        </div>

        {isOtpVisible && (
          <div className="vf-input-container vf-input-container--full-width">
            <label htmlFor="stage-two-demo-code" className="vf-input-label">
              Enter OTP
              <span className="vf-input-required-indicator">*</span>
            </label>

            <input
              id="stage-two-demo-code"
              type="text"
              className="vf-input vf-input--medium"
              placeholder="Enter your OTP here"
              value={demoCode}
              onChange={onDemoCodeChange}
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
  );
}

export default StageTwoForm;
