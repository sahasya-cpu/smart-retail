import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login({ role = 'customer' }) {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(role === 'owner' ? 'owner@smartretail.com' : '');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOwner = role === 'owner';

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    if (isOwner && result.user.role !== 'owner') {
      toast.error('This account is not an owner account.');
      return;
    }
    if (!isOwner && result.user.role !== 'customer') {
      toast.error('This is an owner account — please use the owner sign-in page.');
      return;
    }

    toast.success(`Welcome back, ${result.user.name}!`);
    const redirectTo = location.state?.from?.pathname || (isOwner ? '/owner/dashboard' : '/products');
    navigate(redirectTo, { replace: true });
  }

  return (
    <AuthLayout title={isOwner ? 'Owner sign-in' : 'Welcome back'} subtitle={isOwner ? 'Manage your store' : 'Sign in to keep shopping'}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p style={{ marginTop: '1.2rem', fontSize: '0.85rem', color: 'var(--color-ink-soft)' }}>
        Demo password for every seeded account: <code>password123</code>
      </p>

      {!isOwner && (
        <p style={{ marginTop: '0.4rem', fontSize: '0.88rem' }}>
          New here? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Create an account</Link>
        </p>
      )}
      <p style={{ marginTop: '0.4rem', fontSize: '0.82rem' }}>
        {isOwner ? (
          <Link to="/login" style={{ color: 'var(--color-ink-soft)' }}>← Back to customer sign-in</Link>
        ) : (
          <Link to="/owner/login" style={{ color: 'var(--color-ink-soft)' }}>Store owner? Sign in here →</Link>
        )}
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background:
          'radial-gradient(circle at 15% 15%, var(--color-primary-soft), transparent 45%), var(--color-bg)',
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: '2.2rem' }}>
        <div style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>🛒</div>
        <h1 style={{ fontSize: '1.5rem' }}>{title}</h1>
        <p style={{ color: 'var(--color-ink-soft)', marginBottom: '1.5rem' }}>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
