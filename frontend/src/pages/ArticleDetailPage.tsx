import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Article, Comment } from '../api';
import { createComment, fetchArticle } from '../api';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const toast = useToast();
  const [article, setArticle] = useState<(Article & { comments: Comment[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchArticle(id)
      .then(setArticle)
      .catch(() => setError('Failed to load article.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentContent.trim()) return;
    try {
      setSubmitting(true);
      const newComment = await createComment(id, { content: commentContent.trim() });
      setArticle((cur) => cur ? { ...cur, comments: [...cur.comments, newComment] } : cur);
      setCommentContent('');
      toast.success('Comment posted.');
    } catch {
      toast.error("Couldn't post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <section className="page"><div className="state-message loading"><div className="spinner" /><span>Loading…</span></div></section>;
  }
  if (error) {
    return <section className="page"><div className="state-message error">{error}</div></section>;
  }
  if (!article) {
    return <section className="page"><div className="state-message">Article not found.</div></section>;
  }

  const isOwnArticle = Boolean(user && article.user_id != null && user.id === article.user_id);

  return (
    <section className="page article-detail">
      <article className="card">
        <header className="card-header">
          <h2>{article.title}</h2>
          <div className="card-meta" style={{ marginTop: '0.25rem' }}>
            <span>{formatDate(article.created_at)}</span>
            <span className="card-meta-dot" />
            <span>{readingTime(article.content)}</span>
          </div>
        </header>
        <div className="article-content">
          {article.content.split('\n').filter(Boolean).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      <section className="comments">
        <h3 className="section-title">
          {article.comments.length === 0 ? 'No comments yet' : `${article.comments.length} ${article.comments.length === 1 ? 'comment' : 'comments'}`}
        </h3>
        {article.comments.length > 0 && (
          <ul className="comment-list">
            {article.comments.map((comment) => (
              <li key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.author_name}</span>
                  <span className="comment-date">{formatDate(comment.created_at)}</span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="comment-form-section">
        <h3 className="section-title">Leave a comment</h3>
        {!user ? (
          <p className="muted" style={{ fontSize: '0.9rem' }}>
            <Link to="/login" style={{ color: 'var(--gold)' }}>Sign in</Link> to join the conversation.
          </p>
        ) : isOwnArticle ? (
          <p className="muted" style={{ fontSize: '0.9rem' }}>You can't comment on your own article.</p>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="comment">Your comment</label>
              <textarea
                id="comment"
                rows={4}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your thoughts…"
                required
              />
            </div>
            <button type="submit" className="button" disabled={submitting}>
              {submitting ? 'Posting…' : 'Post comment'}
            </button>
          </form>
        )}
      </section>
    </section>
  );
};
