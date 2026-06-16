export function getRouteState(hashValue) {
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

  return { type: 'home' };
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
        href: `#${prefix}/${key}`,
        label: pages[key].name
      }))
  };
}
