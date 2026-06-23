import { getRoutePath } from './routes.js';

const siteOrigin = 'https://moszeed.github.io';
const defaultTitle = 'Moszeed - Developer, Dad, Nerd';
const defaultDescription =
  'Personal website of Michael Roeber with posts, projects, notes and curated resources around code, tools and experiments.';

export function buildRouteMetadata(route, siteData) {
  const routePath = getRoutePath(route);
  const canonicalUrl = new URL(routePath, siteOrigin).toString();
  const entry = getContentEntry(route, siteData);
  const metadata = {
    title: defaultTitle,
    description: defaultDescription,
    canonicalUrl,
    robots: 'index,follow',
    ogType: route?.type === 'blog' ? 'article' : 'website'
  };

  if (!route || route.type === 'home') {
    return metadata;
  }

  if (route.type === 'impressum') {
    return {
      ...metadata,
      title: `Impressum | ${defaultTitle}`,
      description: 'Impressum und Kontaktinformationen von Moszeed.',
      robots: 'noindex,follow'
    };
  }

  if (route.type === 'datenschutz') {
    return {
      ...metadata,
      title: `Datenschutz | ${defaultTitle}`,
      description: 'Datenschutzhinweise fuer die Website von Moszeed.',
      robots: 'noindex,follow'
    };
  }

  if (route.type === 'link') {
    return {
      ...metadata,
      title: `${entry?.name ?? 'Link'} | ${defaultTitle}`,
      description:
        entry?.description ?? 'Externe Projektseite von Moszeed.',
      robots: 'noindex,follow'
    };
  }

  if (route.type === 'project') {
    return {
      ...metadata,
      title: `${entry?.name ?? 'Project'} | ${defaultTitle}`,
      description:
        entry?.description ?? 'Projektuebersicht von Moszeed.'
    };
  }

  if (route.type === 'blog') {
    return {
      ...metadata,
      title: `${entry?.name ?? 'Post'} | ${defaultTitle}`,
      description:
        entry?.description ?? 'Beitrag von Moszeed.'
    };
  }

  return metadata;
}

export function applyRouteMetadata(metadata) {
  if (typeof document === 'undefined' || !metadata) {
    return;
  }

  document.title = metadata.title;
  setOrCreateMeta('name', 'description', metadata.description);
  setOrCreateMeta('name', 'robots', metadata.robots);
  setOrCreateMeta('property', 'og:title', metadata.title);
  setOrCreateMeta('property', 'og:description', metadata.description);
  setOrCreateMeta('property', 'og:type', metadata.ogType);
  setOrCreateMeta('property', 'og:url', metadata.canonicalUrl);
  setOrCreateMeta('name', 'twitter:card', 'summary');
  setOrCreateMeta('name', 'twitter:title', metadata.title);
  setOrCreateMeta('name', 'twitter:description', metadata.description);
  setCanonicalLink(metadata.canonicalUrl);
}

function getContentEntry(route, siteData) {
  if (!route || !siteData) {
    return null;
  }

  if (route.type === 'blog') {
    return (
      siteData.posts.find((entry) => entry.key === route.slug) ??
      siteData.pages[route.slug] ??
      null
    );
  }

  if (route.slug) {
    return siteData.pages[route.slug] ?? null;
  }

  return null;
}

function setOrCreateMeta(attribute, key, value) {
  let meta = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', value);
}

function setCanonicalLink(href) {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', href);
}
