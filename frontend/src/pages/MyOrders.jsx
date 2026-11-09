import { useState, useEffect } from 'react';
import axios from 'axios';

const STATUS_STYLE = {
  Pending:   { background: '#fff3cd', color: '#856404' },
  Confirmed: { background: '#d1ecf1', color: '#0c5460' },
  Delivered: { background: '#d4edda', color: '#155724' },
};

export default function MyOrders({ user }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/orders/user/${user._id}`)
      .then(r => { setOrders(r.data); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={s.spinnerWrap}>
      <div style={s.spinner} />
      <p style={s.spinnerText}>Loading your orders...</p>
    </div>
  );

  return (
    <div>
      <h2 style={s.heading}>📦 My Orders</h2>
      {orders.length === 0
        ? (
          <div style={s.empty}>
            <div style={{ fontSize: '4.5rem' }}>📦</div>
            <h3 style={s.emptyTitle}>No orders yet</h3>
            <p style={s.emptySub}>You haven't placed any orders. Start shopping!</p>
          </div>
        )
        : orders.map(order => (
          <div key={order._id} style={s.card}>
            <div style={s.cardHeader}>
              <div>
                <p style={s.orderId}>Order #{order._id.slice(-8).toUpperCase()}</p>
                <p style={s.date}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span style={{ ...s.statusBadge, ...STATUS_STYLE[order.status] }}>{order.status}</span>
            </div>

            <div style={s.items}>
              {order.items.map((item, i) => (
                <div key={i} style={s.itemRow}>
                  <span>🌱 {item.name}</span>
                  <span style={{ color: '#888' }}>x{item.quantity}</span>
                  <span style={{ fontWeight: '600', color: '#2c6e49' }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={s.cardFooter}>
              <span style={{ color: '#555', fontSize: '0.85rem' }}>📍 {order.address}</span>
              <span style={s.total}>Total: ₹{order.total}</span>
            </div>
          </div>
        ))
      }
    </div>
  );
}

const s = {
  heading:     { color: '#2c6e49', marginBottom: '1.5rem', fontSize: '1.4rem' },
  spinnerWrap: { textAlign: 'center', padding: '4rem' },
  spinner:     { width: '40px', height: '40px', border: '4px solid #e0e0e0', borderTop: '4px solid #2c6e49', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' },
  spinnerText: { color: '#888', fontSize: '0.95rem' },
  empty:       { textAlign: 'center', padding: '5rem 2rem' },
  emptyTitle:  { color: '#555', marginTop: '1rem', fontSize: '1.2rem' },
  emptySub:    { color: '#888', fontSize: '0.9rem', marginTop: '0.4rem' },
  card:        { background: '#fff', borderRadius: '12px', padding: '1.3rem 1.5rem', marginBottom: '1.2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  cardHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  orderId:     { fontWeight: '700', color: '#1a3c2b', margin: '0 0 0.2rem', fontFamily: 'monospace', fontSize: '0.95rem' },
  date:        { color: '#888', fontSize: '0.82rem', margin: 0 },
  statusBadge: { padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '700' },
  items:       { borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '0.8rem 0', marginBottom: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  itemRow:     { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#444' },
  cardFooter:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  total:       { fontWeight: '800', color: '#2c6e49', fontSize: '1rem' },
};
