import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { normalizeContentPath } from '../lib/site-content.js';

export default function MarkdownPage({ title, markdown, sourcePath }) {
  const [content, setContent] = useState(markdown ?? '');
  const [isLoading, setIsLoading] = useState(Boolean(sourcePath && !markdown));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (markdown) {
      setContent(markdown);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!sourcePath) {
      setContent('');
      setIsLoading(false);
      setError('No source file configured.');
      return;
    }

    let isActive = true;

    setIsLoading(true);
    setError(null);

    fetch(normalizeContentPath(sourcePath))
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
  }, [markdown, sourcePath]);

  return (
    <article className="page page-markdown">
      {title ? (
        <header className="page-header">
          <h1>{title}</h1>
        </header>
      ) : null}

      {isLoading ? <p className="state-message">Loading page...</p> : null}
      {error ? <p className="state-message">Unable to load page: {error}</p> : null}

      {!isLoading && !error ? (
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      ) : null}
    </article>
  );
}
