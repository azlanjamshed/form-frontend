function ProcessingScreen() {
  return (
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
  );
}

export default ProcessingScreen;
