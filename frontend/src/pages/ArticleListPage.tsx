import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles } from '../api';
import type { Article } from '../api';
import { useAuth } from '../AuthContext';

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function summarize(content: string): string {
  const plain = content.replace(/\n+/g, ' ').trim();
  return plain.length <= 140 ? plain : plain.slice(0, 140) + '…';
}

export const ArticleListPage: React.FC = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .catch(() => setError('Failed to load articles.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="page">
        <div className="state-message loading">
          <div className="spinner" />
          <span>Loading…</span>
        </div>
      </section>
    );
  }

  if (error) {
    return <section className="page"><div className="state-message error">{error}</div></section>;
  }

  return (
    <section className="page">
      <div className="page-header">
        <h2>Articles</h2>
        <p className="page-sub">
          {articles.length === 0
            ? 'Nothing published yet.'
            : `${articles.length} ${articles.length === 1 ? 'story' : 'stories'} · Welcome back, ${user?.name?.split(' ')[0]}`}
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="state-message">No articles yet. Be the first to write one.</div>
      ) : (
        <div className="card-list">
          {articles.map((article) => (
            <article key={article.id} className="card">
              <header className="card-header">
                <h3><Link to={`/articles/${article.id}`}>{article.title}</Link></h3>
                <div className="card-meta">
                  <span>{formatDate(article.created_at)}</span>
                  <span className="card-meta-dot" />
                  <span>{readingTime(article.content)}</span>
                </div>
              </header>
              <p className="card-body">{summarize(article.content)}</p>
              <footer className="card-footer">
                <Link to={`/articles/${article.id}`} className="button-link">Read more</Link>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
