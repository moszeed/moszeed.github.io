import PostList from './PostList.jsx';

export default function HomePage({ posts }) {
  return (
    <section className="page page-home">
      <header className="page-header page-header-compact">
        <h3>Posts</h3>
      </header>
      <PostList posts={posts} />
    </section>
  );
}
