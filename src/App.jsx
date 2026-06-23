import { useEffect, useState } from 'react';
import Layout from './components/Layout.jsx';
import HomePage from './components/HomePage.jsx';
import MarkdownPage from './components/MarkdownPage.jsx';
import ExternalFramePage from './components/ExternalFramePage.jsx';
import ProjectPage from './components/ProjectPage.jsx';
import {
  getLegacyHashRoute,
  getRoutePath,
  getRouteState,
  routeDefinitions
} from './lib/routes.js';
import { applyRouteMetadata, buildRouteMetadata } from './lib/seo.js';
import { loadSiteContent } from './lib/site-content.js';
import { datenschutzMarkdown, impressumMarkdown } from './lib/legal-content.js';

const loadingMessage = 'Loading content...';

export default function App() {
  const [route, setRoute] = useState(() => {
    if (typeof window === 'undefined') {
      return { type: 'home' };
    }

    return getInitialRoute();
  });
  const [siteData, setSiteData] = useState({
    posts: [],
    pages: {},
    isLoading: true,
    error: null
  });

  useEffect(() => {
    function onPopState() {
      setRoute(getRouteState(window.location.pathname));
    }

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
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

  useEffect(() => {
    applyRouteMetadata(buildRouteMetadata(route, siteData));
  }, [route, siteData]);

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

function getInitialRoute() {
  const legacyHashRoute = getLegacyHashRoute(window.location.hash);

  if (legacyHashRoute) {
    const targetPath = getRoutePath(legacyHashRoute);
    window.history.replaceState({}, '', targetPath);
    return legacyHashRoute;
  }

  return getRouteState(window.location.pathname);
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
