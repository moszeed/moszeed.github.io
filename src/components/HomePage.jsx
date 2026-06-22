import PostList from './PostList.jsx';

export default function HomePage({ posts }) {
  return (
    <section className="page page-home">
      <div className="home-grid">
        <section className="pixel-panel about-panel">
          <header className="panel-header">
            <h2>About me</h2>
            <span className="panel-badge">NEW</span>
          </header>
          <p>
            I am Moszeed from Germany. I like building small apps, writing code,
            and publishing practical things that are useful later.
          </p>
          <p>
            This page collects notes, projects, experiments and links that grew
            out of that work over time.
          </p>
          <ul className="pixel-list">
            <li>Focus: compact tools, scripts and web experiments</li>
            <li>Style: practical, lightweight and self-hostable</li>
            <li>Format: markdown-first publishing with a retro shell</li>
          </ul>
        </section>

        <section className="pixel-panel status-panel">
          <header className="panel-header">
            <h2>Status</h2>
          </header>
          <div className="status-rows">
            <div className="status-row">
              <span>Location</span>
              <strong>Germany</strong>
            </div>
            <div className="status-row">
              <span>Mode</span>
              <strong>Building</strong>
            </div>
            <div className="status-row">
              <span>Stack</span>
              <strong>Code / Pages / Modules</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="pixel-panel posts-panel">
        <header className="page-header page-header-compact panel-header">
          <h2>Posts</h2>
          <span className="panel-badge">{posts.length}</span>
        </header>
        <PostList posts={posts} />
      </section>
    </section>
  );
}
