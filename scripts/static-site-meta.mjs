export function buildRoutePathList(posts, pages) {
  const routes = [
    { path: '/', type: 'home', indexable: true },
    { path: '/impressum/', type: 'impressum', indexable: false },
    { path: '/datenschutz/', type: 'datenschutz', indexable: false }
  ];

  for (const post of posts) {
    routes.push({
      path: `/blog/${post.key}/`,
      type: 'blog',
      slug: post.key,
      sourcePath: post.link,
      entry: post,
      indexable: true
    });
  }

  for (const [key, page] of Object.entries(pages)) {
    if (page.type === 'github') {
      routes.push({
        path: `/pages/${key}/`,
        type: 'project',
        slug: key,
        entry: page,
        indexable: true
      });
      continue;
    }

    if (page.type === 'link') {
      routes.push({
        path: `/link/${key}/`,
        type: 'link',
        slug: key,
        entry: page,
        indexable: false
      });
      continue;
    }

    routes.push({
      path: `/blog/${key}/`,
      type: 'blog',
      slug: key,
      sourcePath: page.link,
      entry: page,
      indexable: true
    });
  }

  return routes;
}

export function buildStaticMetadata(route, siteData) {
  const siteOrigin = 'https://moszeed.github.io';
  const defaultTitle = 'Moszeed - Developer, Dad, Nerd';
  const defaultDescription =
    'Personal website of Michael Roeber with posts, projects, notes and curated resources around code, tools and experiments.';
  const canonicalUrl = new URL(route.path, siteOrigin).toString();
  const metadata = {
    title: defaultTitle,
    description: defaultDescription,
    canonicalUrl,
    robots: route.indexable ? 'index,follow' : 'noindex,follow',
    ogType: route.type === 'blog' ? 'article' : 'website'
  };

  if (route.type === 'home') {
    return metadata;
  }

  if (route.type === 'impressum') {
    return {
      ...metadata,
      title: `Impressum | ${defaultTitle}`,
      description: 'Impressum und Kontaktinformationen von Moszeed.'
    };
  }

  if (route.type === 'datenschutz') {
    return {
      ...metadata,
      title: `Datenschutz | ${defaultTitle}`,
      description: 'Datenschutzhinweise fuer die Website von Moszeed.'
    };
  }

  const entry = route.entry ?? siteData.pages?.[route.slug] ?? null;

  return {
    ...metadata,
    title: `${entry?.name ?? 'Moszeed'} | ${defaultTitle}`,
    description: entry?.description ?? defaultDescription
  };
}
