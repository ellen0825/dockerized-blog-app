import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!name.trim() || !trimmedEmail || !password || !passwordConfirmation) {
      setError('Please fill in all fields.');
      toast.error('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      toast.error('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const { user, token } = await registerUser({
        name: name.trim(),
        email: trimmedEmail,
        password,
        password_confirmation: passwordConfirmation,
      });
      setUser(user, token);
      toast.success('Account created. Welcome.');
      navigate('/articles');
    } catch {
      setError('Registration failed. Please check your details.');
      toast.error('Registration failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <p className="auth-eyebrow">Get started</p>
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-subtitle">Join and start publishing your ideas.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="name">Full name</label>
              <input id="name" className="auth-input" type="text" value={name}
                onChange={(e) => setName(e.target.value)} placeholder="Jane Smith"
                required autoComplete="name" />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <input id="email" className="auth-input" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                required autoComplete="email" />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <input id="password" className="auth-input" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters"
                required minLength={8} autoComplete="new-password" />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="passwordConfirmation">Confirm password</label>
              <input id="passwordConfirmation" className="auth-input" type="password" value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Repeat password"
                required autoComplete="new-password" />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="auth-button" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="auth-footer">
            <span>Already have an account?</span>
            <Link to="/login" className="auth-footer-link">Sign in</Link>
          </div>
        </div>
      </div>

      <aside className="auth-side">
        <p className="auth-side-quote">
          Write what should not be forgotten.
        </p>
        <div className="auth-side-dots">
          <span className="auth-side-dot" />
          <span className="auth-side-dot active" />
          <span className="auth-side-dot" />
        </div>
      </aside>
    </div>
  );
};
