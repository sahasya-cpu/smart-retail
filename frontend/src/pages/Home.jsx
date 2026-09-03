import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'radial-gradient(circle at 85% 10%, var(--color-accent-soft), transparent 45%), var(--color-bg)',
      }}
    >
      <div style={{ maxWidth: 560, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛒</div>
        <h1 style={{ fontSize: '2.4rem' }}>Smart Retail Intelligence Platform</h1>
        <p style={{ color: 'var(--color-ink-soft)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          A live bridge between your storefront and your customers — orders, inventory, and demand
          forecasts, updated the instant they happen.
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={user?.role === 'customer' ? '/products' : '/login'} className="btn btn-primary">
            Shop as a customer
          </Link>
          <Link to="/owner/login" className="btn btn-outline">
            Sign in as store owner
          </Link>
        </div>
      </div>
    </div>
  );
}
