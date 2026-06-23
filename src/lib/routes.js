export function getRouteState(pathValue) {
  const path = normalizePath(pathValue);

  if (path === '/') {
    return { type: 'home' };
  }

  if (path === '/impressum') {
    return { type: 'impressum' };
  }

  if (path === '/datenschutz') {
    return { type: 'datenschutz' };
  }

  if (path.startsWith('/blog/')) {
    return { type: 'blog', slug: path.slice('/blog/'.length) };
  }

  if (path.startsWith('/pages/')) {
    return { type: 'project', slug: path.slice('/pages/'.length) };
  }

  if (path.startsWith('/link/')) {
    return { type: 'link', slug: path.slice('/link/'.length) };
  }

  return { type: 'home' };
}

export function getLegacyHashRoute(hashValue) {
  if (!hashValue) {
    return null;
  }

  const hash = hashValue.replace(/^#/, '');

  if (!hash || hash === '/') {
    return { type: 'home' };
  }

  if (hash === 'impressum') {
    return { type: 'impressum' };
  }

  if (hash === 'datenschutz') {
    return { type: 'datenschutz' };
  }

  if (hash.startsWith('blog/')) {
    return { type: 'blog', slug: hash.slice('blog/'.length) };
  }

  if (hash.startsWith('pages/')) {
    return { type: 'project', slug: hash.slice('pages/'.length) };
  }

  if (hash.startsWith('link/')) {
    return { type: 'link', slug: hash.slice('link/'.length) };
  }

  return null;
}

export function getRoutePath(route) {
  if (!route || route.type === 'home') {
    return '/';
  }

  if (route.type === 'impressum') {
    return '/impressum/';
  }

  if (route.type === 'datenschutz') {
    return '/datenschutz/';
  }

  if (route.type === 'blog') {
    return `/blog/${route.slug}/`;
  }

  if (route.type === 'project') {
    return `/pages/${route.slug}/`;
  }

  if (route.type === 'link') {
    return `/link/${route.slug}/`;
  }

  return '/';
}

export function routeDefinitions(pages) {
  const keys = Object.keys(pages);

  return [
    buildSection('.pages', keys, pages, 'link', 'link'),
    buildSection('.projects', keys, pages, 'github', 'pages'),
    buildSection('.drawing', keys, pages, 'drawing', 'blog'),
    buildSection('.unity', keys, pages, 'unity', 'blog'),
    buildSection('.other', keys, pages, 'other', 'blog')
  ];
}

function buildSection(title, keys, pages, pageType, prefix) {
  return {
    title,
    items: keys
      .filter((key) => pages[key]?.type === pageType)
      .map((key) => ({
        href: `/${prefix}/${key}/`,
        label: pages[key].name
      }))
  };
}

function normalizePath(pathValue = '/') {
  const rawPath = String(pathValue).split('?')[0].split('#')[0] || '/';
  const withLeadingSlash = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;

  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')) {
    return withLeadingSlash.slice(0, -1);
  }

  return withLeadingSlash;
}
