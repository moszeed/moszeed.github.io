import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectPage({ page }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(Boolean(page?.readme));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!page?.readme) {
      setContent('');
      setIsLoading(false);
      setError(null);
      return;
    }

    let isActive = true;

    setIsLoading(true);
    setError(null);

    fetch(page.readme, {
      headers: {
        Accept: 'application/vnd.github.raw+json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.text();
      })
      .then((value) => {
        if (!isActive) {
          return;
        }

        setContent(value);
        setIsLoading(false);
      })
      .catch((fetchError) => {
        if (!isActive) {
          return;
        }

        setError(fetchError.message);
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [page]);

  if (!page) {
    return <p className="state-message">Project not found.</p>;
  }

  return (
    <article className="page page-markdown">
      <section className="project-link-row">
        open on GitHub:{' '}
        <a className="external-link" href={page.link} target="_blank" rel="noreferrer">
          {page.link}
        </a>
      </section>
      <hr className="section-divider" />

      {isLoading ? <p className="state-message">Loading README...</p> : null}
      {error ? <p className="state-message">Unable to load README: {error}</p> : null}

      {!isLoading && !error && content ? (
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      ) : null}
    </article>
  );
}
