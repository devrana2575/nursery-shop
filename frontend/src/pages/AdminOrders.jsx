import { useState, useEffect } from 'react';
import axios from 'axios';

const STATUSES = ['Pending', 'Confirmed', 'Delivered'];

const STATUS_STYLE = {
  Pending:   { background: '#fff3cd', color: '#856404' },
  Confirmed: { background: '#d1ecf1', color: '#0c5460' },
  Delivered: { background: '#d4edda', color: '#155724' },
};

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    axios.get('/api/orders').then(r => { setOrders(r.data); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`/api/orders/${id}`, { status });
    fetchOrders();
  };

  if (loading) return <p style={{ color: '#888', padding: '1rem' }}>Loading orders...</p>;

  return (
    <div>
      <h2 style={s.heading}>📦 All Orders <span style={s.count}>({orders.length})</span></h2>

      {orders.length === 0
        ? <p style={{ color: '#888' }}>No orders placed yet.</p>
        : orders.map(order => (
          <div key={order._id} style={s.card}>
            <div style={s.cardHeader}>
              <div>
                <p style={s.orderId}>#{order._id.slice(-8).toUpperCase()}</p>
                <p style={s.meta}>👤 {order.userName} &nbsp;·&nbsp; {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div style={s.rightCol}>
                <span style={{ ...s.statusBadge, ...STATUS_STYLE[order.status] }}>{order.status}</span>
                <select
                  style={s.select}
                  value={order.status}
                  onChange={e => updateStatus(order._id, e.target.value)}
                >
                  {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>

            <div style={s.items}>
              {order.items.map((item, i) => (
                <div key={i} style={s.itemRow}>
                  <span>🌱 {item.name}</span>
                  <span style={{ color: '#888' }}>x{item.quantity}</span>
                  <span style={{ color: '#2c6e49', fontWeight: '600' }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={s.cardFooter}>
              <span style={{ color: '#666', fontSize: '0.85rem' }}>📍 {order.address}</span>
              <span style={s.total}>₹{order.total}</span>
            </div>
          </div>
        ))
      }
    </div>
  );
}

const s = {
  heading:     { color: '#2c6e49', marginBottom: '1.5rem', fontSize: '1.4rem' },
  count:       { color: '#888', fontWeight: '400', fontSize: '1rem' },
  card:        { background: '#fff', borderRadius: '12px', padding: '1.3rem 1.5rem', marginBottom: '1.2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  cardHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  orderId:     { fontWeight: '700', color: '#1a3c2b', margin: '0 0 0.2rem', fontFamily: 'monospace' },
  meta:        { color: '#888', fontSize: '0.82rem', margin: 0 },
  rightCol:    { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' },
  statusBadge: { padding: '0.25rem 0.8rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: '700' },
  select:      { padding: '0.35rem 0.7rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.85rem', background: '#fff', cursor: 'pointer' },
  items:       { borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '0.8rem 0', marginBottom: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  itemRow:     { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#444' },
  cardFooter:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  total:       { fontWeight: '800', color: '#2c6e49', fontSize: '1.05rem' },
};
