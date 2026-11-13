function ToolPinForm({
  toolPinNumber,
  toolPinError,
  isSavingToolPin,
  onToolPinChange,
  onSubmit,
}) {
  return (
    <section className="vf-lucky-card">
      <div className="vf-lucky-card__content">
        <h1>What's Your Tool Pin Number?</h1>

        <p className="vf-lucky-card__description">
          Enter your Tool Pin number to continue.
        </p>

        <form className="vf-landing-form" onSubmit={onSubmit}>
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
              onChange={onToolPinChange}
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
  );
}

export default ToolPinForm;
