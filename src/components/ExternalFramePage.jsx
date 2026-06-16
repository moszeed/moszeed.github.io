export default function ExternalFramePage({ page }) {
  if (!page) {
    return <p className="state-message">Page not found.</p>;
  }

  return (
    <section className="page page-frame">
      <div className="frame-shell">
        <iframe src={page.link} title={page.name} />
      </div>
    </section>
  );
}
