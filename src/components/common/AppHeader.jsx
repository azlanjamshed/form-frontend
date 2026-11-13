function AppHeader() {
  return (
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
  );
}

export default AppHeader;
