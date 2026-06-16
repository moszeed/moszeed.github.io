export default function NavSection({ title, items, onNavigate }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="nav-section">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} onClick={onNavigate}>
              .{item.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
