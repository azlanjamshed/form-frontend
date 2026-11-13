function StageOneCompleted({ onContinue }) {
  return (
    <section className="vf-landing-card vf-landing-success">
      <div className="vf-landing-success__icon">✓</div>

      <h1>Your first verification has been completed</h1>

      <p>Your first verification was completed successfully.</p>

      <button
        type="button"
        className="vf-button vf-button--primary vf-button--large vf-button--full-width"
        style={{ backgroundColor: "#C96B4F" }}
        onClick={onContinue}
      >
        <span className="vf-button__content">Move to Next Step</span>
      </button>
    </section>
  );
}

export default StageOneCompleted;
