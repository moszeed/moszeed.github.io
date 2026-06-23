import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { impressumMarkdown, datenschutzMarkdown } from '../src/lib/legal-content.js';
import { buildRoutePathList, buildStaticMetadata } from './static-site-meta.mjs';

const siteRoot = process.cwd();
const distDir = path.join(siteRoot, 'dist');
const templatePath = path.join(distDir, 'index.html');
const postsPath = path.join(siteRoot, 'assets', 'posts.json');
const pagesPath = path.join(siteRoot, 'assets', 'pages.json');

const [templateHtml, postsRaw, pagesRaw] = await Promise.all([
  readFile(templatePath, 'utf8'),
  readFile(postsPath, 'utf8'),
  readFile(pagesPath, 'utf8')
]);

const posts = JSON.parse(postsRaw).sort((first, second) => {
  return Date.parse(second.created) - Date.parse(first.created);
});
const pages = JSON.parse(pagesRaw);
const navSections = buildNavSections(pages);
const routeList = buildRoutePathList(posts, pages);

for (const route of routeList) {
  const renderedPage = await renderPage(route, { posts, pages, navSections });
  const metadata = buildStaticMetadata(route, { posts, pages });
  const outputHtml = applyPage(templateHtml, metadata, renderedPage);
  const targetPath =
    route.path === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.path.replace(/^\//, ''), 'index.html');

  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, outputHtml, 'utf8');
}

await writeFile(path.join(distDir, 'robots.txt'), buildRobotsTxt(), 'utf8');
await writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml(routeList), 'utf8');
await writeFile(path.join(distDir, '404.html'), await readFile(path.join(distDir, 'index.html'), 'utf8'), 'utf8');

async function renderPage(route, context) {
  if (route.type === 'home') {
    return renderHomePage(context.posts);
  }

  if (route.type === 'impressum') {
    return renderMarkdownPage(impressumMarkdown);
  }

  if (route.type === 'datenschutz') {
    return renderMarkdownPage(datenschutzMarkdown, 'Datenschutz');
  }

  if (route.type === 'blog') {
    const markdown = await loadMarkdown(route.sourcePath);
    return renderMarkdownPage(markdown);
  }

  if (route.type === 'project') {
    return renderProjectPage(route.entry);
  }

  if (route.type === 'link') {
    return renderLinkPage(route.entry);
  }

  return renderHomePage(context.posts);
}

function renderHomePage(posts) {
  return renderLayout(`
    <section class="page page-home">
      <div class="home-grid">
        <section class="pixel-panel about-panel">
          <header class="panel-header">
            <h2>About me</h2>
            <span class="panel-badge">NEW</span>
          </header>
          <p>
            I am Moszeed from Germany. I like building small apps, writing code,
            and publishing practical things that are useful later.
          </p>
          <p>
            This page collects notes, projects, experiments and links that grew
            out of that work over time.
          </p>
          <ul class="pixel-list">
            <li>Focus: compact tools, scripts and web experiments</li>
            <li>Style: practical, lightweight and self-hostable</li>
            <li>Format: markdown-first publishing with a retro shell</li>
          </ul>
        </section>
        <section class="pixel-panel status-panel">
          <header class="panel-header">
            <h2>Status</h2>
          </header>
          <div class="status-rows">
            <div class="status-row"><span>Location</span><strong>Germany</strong></div>
            <div class="status-row"><span>Mode</span><strong>Building</strong></div>
            <div class="status-row"><span>Stack</span><strong>Code / Pages / Modules</strong></div>
          </div>
        </section>
      </div>
      <section class="pixel-panel posts-panel">
        <header class="page-header page-header-compact panel-header">
          <h2>Posts</h2>
          <span class="panel-badge">${posts.length}</span>
        </header>
        <div class="post-list">
          ${posts.map(renderPostCard).join('')}
        </div>
      </section>
    </section>
  `);
}

function renderPostCard(post) {
  const prefix = post.subtype ? `<span>[${escapeHtml(post.subtype)}] </span>` : '';

  return `
    <a class="post-card" href="/blog/${post.key}/">
      <div class="post-date">${escapeHtml(formatDate(post.created))}</div>
      <div class="post-copy">
        <h2>${prefix}${escapeHtml(post.name)}</h2>
        <p>${escapeHtml(post.description)}</p>
      </div>
    </a>
  `;
}

function renderMarkdownPage(markdown, title) {
  const markdownHtml = renderMarkdown(markdown);
  const headerHtml = title
    ? `<header class="page-header"><h1>${escapeHtml(title)}</h1></header>`
    : '';

  return renderLayout(`
    <article class="page page-markdown">
      ${headerHtml}
      <div class="markdown-body">${markdownHtml}</div>
    </article>
  `);
}

function renderProjectPage(entry) {
  return renderLayout(`
    <article class="page page-markdown">
      <header class="page-header">
        <h1>${escapeHtml(entry.name)}</h1>
      </header>
      <section class="pixel-panel">
        <p>${escapeHtml(entry.description)}</p>
        <p>
          GitHub:
          <a class="external-link" href="${escapeAttribute(entry.link)}" target="_blank" rel="noreferrer">
            ${escapeHtml(entry.link)}
          </a>
        </p>
      </section>
    </article>
  `);
}

function renderLinkPage(entry) {
  return renderLayout(`
    <article class="page page-markdown">
      <header class="page-header">
        <h1>${escapeHtml(entry.name)}</h1>
      </header>
      <section class="pixel-panel">
        <p>${escapeHtml(entry.description)}</p>
        <p>
          External project page:
          <a class="external-link" href="${escapeAttribute(entry.link)}" target="_blank" rel="noreferrer">
            ${escapeHtml(entry.link)}
          </a>
        </p>
      </section>
    </article>
  `);
}

function renderLayout(contentHtml) {
  return `
    <div class="shell">
      <button class="menu-backdrop" type="button" aria-label="Close menu"></button>
      <aside class="sidebar">
        <div class="intro-card">
          <span>Hi and welcome, I am Moszeed from Germany. I love to write code and build apps, pages and modules.</span>
        </div>
        <nav class="navigation">
          <a class="index-link" href="/">.index</a>
          ${navSections
            .map((section) => {
              return `
                <section class="nav-section">
                  <h2>${escapeHtml(section.title)}</h2>
                  <ul>
                    ${section.items
                      .map((item) => `<li><a href="${item.href}">.${escapeHtml(item.label)}</a></li>`)
                      .join('')}
                  </ul>
                </section>
              `;
            })
            .join('')}
        </nav>
        <footer class="sidebar-footer">
          <a href="/impressum/">Impressum</a>
          <a href="/datenschutz/">Datenschutz</a>
        </footer>
      </aside>
      <main class="content-panel">
        <div class="mobile-topbar">
          <button class="menu-toggle" type="button" aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
          <a class="mobile-home-link" href="/">moszeed.github.io</a>
        </div>
        ${contentHtml}
      </main>
    </div>
  `;
}

function applyPage(templateHtml, metadata, rootContent) {
  const cleanedTemplate = templateHtml
    .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, '')
    .replace(/\s*<meta\s+name="robots"[\s\S]*?\/>/, '')
    .replace(/\s*<link\s+rel="canonical"[\s\S]*?>/, '');

  const headTags = `
    <meta name="description" content="${escapeAttribute(metadata.description)}" />
    <meta name="robots" content="${escapeAttribute(metadata.robots)}" />
    <link rel="canonical" href="${escapeAttribute(metadata.canonicalUrl)}" />
    <meta property="og:title" content="${escapeAttribute(metadata.title)}" />
    <meta property="og:description" content="${escapeAttribute(metadata.description)}" />
    <meta property="og:type" content="${escapeAttribute(metadata.ogType)}" />
    <meta property="og:url" content="${escapeAttribute(metadata.canonicalUrl)}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeAttribute(metadata.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(metadata.description)}" />
  `;

  return cleanedTemplate
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace('</head>', `${headTags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${rootContent}</div>`);
}

function buildNavSections(pages) {
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

function renderMarkdown(markdown) {
  return renderToStaticMarkup(
    React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, markdown)
  );
}

async function loadMarkdown(sourcePath) {
  const targetPath = path.join(siteRoot, sourcePath.replace(/^\.\//, ''));
  return readFile(targetPath, 'utf8');
}

function formatDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function buildRobotsTxt() {
  return ['User-agent: *', 'Allow: /', 'Sitemap: https://moszeed.github.io/sitemap.xml', ''].join('\n');
}

function buildSitemapXml(routeList) {
  const urls = routeList
    .filter((route) => route.indexable)
    .map((route) => {
      return `  <url><loc>https://moszeed.github.io${route.path}</loc></url>`;
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    ''
  ].join('\n');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
