import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AuthLayout } from './Login';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    const result = await register(form.name, form.email, form.password);
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(`Account created — welcome, ${result.user.name}!`);
    navigate('/products', { replace: true });
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start browsing and ordering in a minute">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" className="input" required value={form.name} onChange={update('name')} placeholder="Jane Doe" />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" required value={form.email} onChange={update('email')} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" required value={form.password} onChange={update('password')} placeholder="At least 6 characters" />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p style={{ marginTop: '1.2rem', fontSize: '0.88rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
      </p>
    </AuthLayout>
  );
}
