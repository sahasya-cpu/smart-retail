import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSocket } from '../context/SocketContext';

export default function CustomerNavbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { connected } = useSocket();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) => ({
    padding: '0.5rem 0.9rem',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '0.92rem',
    color: isActive ? 'var(--color-primary)' : 'var(--color-ink-soft)',
    background: isActive ? 'var(--color-primary-soft)' : 'transparent',
  });

  return (
    <header
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <NavLink to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🛒</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem' }}>
            Smart Retail
          </span>
        </NavLink>

        <nav style={{ display: 'flex', gap: '0.3rem', flex: 1 }}>
          <NavLink to="/products" style={linkStyle}>
            Browse
          </NavLink>
          <NavLink to="/orders" style={linkStyle}>
            My orders
          </NavLink>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {user && (
            <span
              title={connected ? 'Live updates connected' : 'Reconnecting…'}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--color-ink-soft)' }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: connected ? 'var(--color-success)' : 'var(--color-border)',
                }}
              />
              {connected ? 'Live' : 'Offline'}
            </span>
          )}

          <NavLink
            to="/cart"
            className="btn btn-outline btn-sm"
            style={{ position: 'relative' }}
          >
            Cart
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: 'var(--color-accent)',
                  color: 'var(--color-primary-dark)',
                  borderRadius: '50%',
                  minWidth: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                }}
              >
                {itemCount}
              </span>
            )}
          </NavLink>

          {user ? (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Sign out
            </button>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm">
              Sign in
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
