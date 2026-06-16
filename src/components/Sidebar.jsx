import NavSection from './NavSection.jsx';

const introText =
  'Hi and welcome, I am Moszeed from Germany. I love to write code and build apps, pages and modules.';

export default function Sidebar({
  navigationSections,
  isLoading,
  loadingMessage
}) {
  return (
    <aside className="sidebar">
      <div className="intro-card">
        <span>{introText}</span>
      </div>

      <nav className="navigation">
        <a className="index-link" href="#/">
          .index
        </a>

        {isLoading ? (
          <p className="nav-loading">{loadingMessage}</p>
        ) : (
          navigationSections.map((section) => (
            <NavSection
              key={section.title}
              title={section.title}
              items={section.items}
            />
          ))
        )}
      </nav>

      <footer className="sidebar-footer">
        <a href="#impressum">Impressum</a>
        <a href="#datenschutz">Datenschutz</a>
      </footer>
    </aside>
  );
}
