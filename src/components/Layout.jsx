import { useState } from 'react';
import Sidebar from './Sidebar.jsx';

export default function Layout({
  navigationSections,
  isLoading,
  loadingMessage,
  children
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function openMobileMenu() {
    setIsMobileMenuOpen(true);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="shell">
      <button
        className={`menu-backdrop ${isMobileMenuOpen ? 'is-open' : ''}`}
        type="button"
        aria-label="Close menu"
        onClick={closeMobileMenu}
      />
      <Sidebar
        navigationSections={navigationSections}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        isMobileMenuOpen={isMobileMenuOpen}
        onNavigate={closeMobileMenu}
      />
      <main className="content-panel">
        <div className="mobile-topbar">
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label="Open menu"
            onClick={openMobileMenu}
          >
            <span />
            <span />
            <span />
          </button>
          <a className="mobile-home-link" href="/">
            moszeed.github.io
          </a>
        </div>
        {children}
      </main>
    </div>
  );
}
