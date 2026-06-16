import { formatDate } from '../lib/site-content.js';

export default function PostList({ posts }) {
  if (!posts.length) {
    return <p className="state-message">No posts found.</p>;
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <a key={post.key} className="post-card" href={`#blog/${post.key}`}>
          <div className="post-date">{formatDate(post.created)}</div>
          <div className="post-copy">
            <h2>
              {post.subtype ? <span>[{post.subtype}] </span> : null}
              {post.name}
            </h2>
            <p>{post.description}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
