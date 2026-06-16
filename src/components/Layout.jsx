import Sidebar from './Sidebar.jsx';

export default function Layout({
  navigationSections,
  isLoading,
  loadingMessage,
  children
}) {
  return (
    <div className="shell">
      <Sidebar
        navigationSections={navigationSections}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
      />
      <main className="content-panel">{children}</main>
    </div>
  );
}
