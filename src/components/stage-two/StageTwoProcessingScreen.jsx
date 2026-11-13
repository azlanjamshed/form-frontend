function StageTwoProcessingScreen({ title, message, note }) {
  return (
    <section
      className="vf-landing-card vf-landing-success vf-landing-processing"
      role="status"
      aria-live="polite"
    >
      <div className="vf-processing-spinner" aria-hidden="true" />

      <h1>{title}</h1>

      <p>{message}</p>

      <p className="vf-landing-success__note">{note}</p>
    </section>
  );
}

export default StageTwoProcessingScreen;
