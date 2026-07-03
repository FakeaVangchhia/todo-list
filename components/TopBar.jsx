'use client';

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <div className="brand-copy">
          <span className="topbar-title">Task App</span>
          <span className="topbar-subtitle">Next.js classroom demo</span>
        </div>
      </div>
    </header>
  );
}
