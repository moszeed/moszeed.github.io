import { useEffect, useState } from 'react';
import Layout from './components/Layout.jsx';
import HomePage from './components/HomePage.jsx';
import MarkdownPage from './components/MarkdownPage.jsx';
import ExternalFramePage from './components/ExternalFramePage.jsx';
import ProjectPage from './components/ProjectPage.jsx';
import { getRouteState, routeDefinitions } from './lib/routes.js';
import { loadSiteContent } from './lib/site-content.js';
import { datenschutzMarkdown, impressumMarkdown } from './lib/legal-content.js';

const loadingMessage = 'Loading content...';

export default function App() {
  const [route, setRoute] = useState(() => getRouteState(window.location.hash));
  const [siteData, setSiteData] = useState({
    posts: [],
    pages: {},
    isLoading: true,
    error: null
  });

  useEffect(() => {
    function onHashChange() {
      setRoute(getRouteState(window.location.hash));
    }

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    let isActive = true;

    loadSiteContent()
      .then((data) => {
        if (!isActive) {
          return;
        }

        setSiteData({
          posts: data.posts,
          pages: data.pages,
          isLoading: false,
          error: null
        });
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        setSiteData((current) => ({
          ...current,
          isLoading: false,
          error: error.message
        }));
      });

    return () => {
      isActive = false;
    };
  }, []);

  const pageContent = renderPage(route, siteData);

  return (
    <Layout
      navigationSections={routeDefinitions(siteData.pages)}
      isLoading={siteData.isLoading}
      loadingMessage={loadingMessage}
    >
      {pageContent}
    </Layout>
  );
}

function renderPage(route, siteData) {
  if (siteData.error) {
    return <p className="state-message">Unable to load content: {siteData.error}</p>;
  }

  if (siteData.isLoading) {
    return <p className="state-message">{loadingMessage}</p>;
  }

  if (route.type === 'impressum') {
    return <MarkdownPage title="Impressum" markdown={impressumMarkdown} />;
  }

  if (route.type === 'datenschutz') {
    return <MarkdownPage title="Datenschutz" markdown={datenschutzMarkdown} />;
  }

  if (route.type === 'blog') {
    return (
      <MarkdownPage
        sourcePath={resolveContentPath(siteData, route.slug)}
      />
    );
  }

  if (route.type === 'project') {
    const page = siteData.pages[route.slug];
    return <ProjectPage page={page} />;
  }

  if (route.type === 'link') {
    const page = siteData.pages[route.slug];
    return <ExternalFramePage page={page} />;
  }

  return <HomePage posts={siteData.posts} />;
}
function resolveContentPath(siteData, slug) {
  const post = siteData.posts.find((entry) => entry.key === slug);
  if (post) {
    return post.link;
  }

  return siteData.pages[slug]?.link ?? '';
}
