import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export default function ProductCard({ product, onAddToCart }) {
  const outOfStock = product.stock <= 0;

  return (
    <div className="card" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--color-primary)',
            background: 'var(--color-primary-soft)',
            padding: '0.15rem 0.5rem',
            borderRadius: 6,
          }}
        >
          {product.category_name || 'General'}
        </span>
        {outOfStock ? (
          <span className="badge badge-rejected">Out of stock</span>
        ) : product.stock <= 10 ? (
          <span className="badge badge-pending">Only {product.stock} left</span>
        ) : null}
      </div>

      <Link to={`/product/${product.id}`}>
        <h3 style={{ fontSize: '1.05rem', margin: '0.2rem 0' }}>{product.name}</h3>
      </Link>
      {product.description && (
        <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-soft)', flex: 1, marginBottom: '0.4rem' }}>
          {product.description.length > 70 ? product.description.slice(0, 70) + '…' : product.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem' }}>
          {formatCurrency(product.price)}
        </span>
        <button
          className="btn btn-accent btn-sm"
          disabled={outOfStock}
          onClick={() => onAddToCart(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
