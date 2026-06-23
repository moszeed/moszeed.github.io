export async function loadSiteContent() {
  const [postsResponse, pagesResponse] = await Promise.all([
    fetch('/posts.json'),
    fetch('/pages.json')
  ]);

  if (!postsResponse.ok || !pagesResponse.ok) {
    throw new Error('Site metadata could not be loaded.');
  }

  const [posts, pages] = await Promise.all([
    postsResponse.json(),
    pagesResponse.json()
  ]);

  return buildSiteData(posts, pages);
}

export function buildSiteData(posts, pages) {
  return {
    posts: [...posts].sort((first, second) => {
      return Date.parse(second.created) - Date.parse(first.created);
    }),
    pages
  };
}

export function normalizeContentPath(path) {
  return path.replace(/^\.\/assets\//, '/');
}

export function formatDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}
