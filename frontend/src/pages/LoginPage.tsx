import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    try {
      setSubmitting(true);
      setError(null);
      const { user, token } = await loginUser({ email: email.trim(), password });
      setUser(user, token);
      toast.success('Welcome back.');
      navigate('/');
    } catch {
      setError('Invalid email or password.');
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <p className="auth-eyebrow">Welcome back</p>
            <h2 className="auth-title">Sign in to your account</h2>
            <p className="auth-subtitle">Pick up where you left off.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="auth-button" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="auth-footer">
            <span>No account?</span>
            <Link to="/register" className="auth-footer-link">Create one</Link>
          </div>
        </div>
      </div>

      <aside className="auth-side">
        <p className="auth-side-quote">
          The scariest moment is always just before you start.
        </p>
        <div className="auth-side-dots">
          <span className="auth-side-dot active" />
          <span className="auth-side-dot" />
          <span className="auth-side-dot" />
        </div>
      </aside>
    </div>
  );
};
