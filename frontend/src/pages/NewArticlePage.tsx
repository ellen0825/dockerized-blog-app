import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../api';
import type { Article } from '../api';
import { useToast } from '../ToastContext';

export const NewArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      setSubmitting(true);
      const article: Article = await createArticle({ title: title.trim(), content: content.trim() });
      toast.success('Article published.');
      navigate(`/articles/${article.id}`);
    } catch {
      toast.error("Couldn't publish. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <section className="page new-article-page">
      <div className="page-header">
        <h2>New article</h2>
        <p className="page-sub">Write something worth reading.</p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your article title…"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">
            Content{wordCount > 0 && <span style={{ color: 'var(--text-3)', fontWeight: 400, marginLeft: '0.5rem' }}>· {wordCount} words</span>}
          </label>
          <textarea
            id="content"
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing…"
            required
          />
        </div>
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Publishing…' : 'Publish article'}
        </button>
      </form>
    </section>
  );
};
