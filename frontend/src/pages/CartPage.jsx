import { useState } from 'react';
import axios from 'axios';

export default function CartPage({ cart, updateQty, clearCart, user, onOrderPlaced }) {
  const [address, setAddress] = useState('');
  const [msg, setMsg]         = useState('');
  const [err, setErr]         = useState('');
  const [placing, setPlacing] = useState(false);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleOrder = async () => {
    if (!address.trim()) return setErr('Please enter a delivery address.');
    setErr(''); setPlacing(true);
    try {
      await axios.post('/api/orders', {
        userId:   user._id,
        userName: user.name,
        items:    cart,
        total,
        address,
      });
      setMsg('🎉 Order placed successfully!');
      setTimeout(() => { setMsg(''); onOrderPlaced(); }, 1800);
    } catch (error) {
      setErr(error.response?.data?.message || 'Order failed. Try again.');
    }
    setPlacing(false);
  };

  if (cart.length === 0) return (
    <div style={s.empty}>
      <div style={{ fontSize: '5rem' }}>🪴</div>
      <h3 style={s.emptyTitle}>Your cart is empty</h3>
      <p style={s.emptySub}>Browse our beautiful plants and add them here!</p>
      <a href="#" onClick={e => { e.preventDefault(); window.history.back(); }} style={s.shopLink}>
        🌿 Continue Shopping
      </a>
    </div>
  );

  return (
    <div>
      <h2 style={s.heading}>🛒 Your Cart</h2>

      {msg && <div style={s.success}>{msg}</div>}
      {err && <div style={s.error}>{err}</div>}

      <div style={s.layout}>
        {/* Cart Items */}
        <div style={s.itemsCol}>
          {cart.map(item => (
            <div key={item.plantId} style={s.item}>
              <div style={s.itemEmoji}>🌱</div>
              <div style={s.itemInfo}>
                <p style={s.itemName}>{item.name}</p>
                <p style={s.itemPrice}>₹{item.price} each</p>
              </div>
              <div style={s.qtyRow}>
                <button style={s.qtyBtn} onClick={() => updateQty(item.plantId, item.quantity - 1)}>−</button>
                <span style={s.qty}>{item.quantity}</span>
                <button style={s.qtyBtn} onClick={() => updateQty(item.plantId, item.quantity + 1)}>+</button>
              </div>
              <p style={s.subtotal}>₹{item.price * item.quantity}</p>
              <button style={s.removeBtn} onClick={() => updateQty(item.plantId, 0)}>✕</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={s.summary}>
          <h3 style={{ color: '#1a3c2b', marginBottom: '1rem' }}>Order Summary</h3>

          <div style={s.summaryRow}>
            <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            <span>₹{total}</span>
          </div>
          <div style={s.summaryRow}>
            <span>Delivery</span>
            <span style={{ color: '#27ae60', fontWeight: '600' }}>FREE</span>
          </div>
          <div style={{ ...s.summaryRow, borderTop: '1px solid #eee', paddingTop: '0.8rem', marginTop: '0.5rem', fontWeight: '700', fontSize: '1.1rem' }}>
            <span>Total</span>
            <span style={{ color: '#2c6e49' }}>₹{total}</span>
          </div>

          <label style={s.label}>Delivery Address</label>
          <textarea
            style={s.textarea}
            rows={3}
            placeholder="Enter your full delivery address..."
            value={address}
            onChange={e => setAddress(e.target.value)}
          />

          <p style={s.cod}>💵 Payment: Cash on Delivery</p>

          <button style={s.orderBtn} onClick={handleOrder} disabled={placing}>
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
          <button style={s.clearBtn} onClick={clearCart}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  heading:    { color: '#2c6e49', marginBottom: '1.5rem', fontSize: '1.4rem' },
  empty:      { textAlign: 'center', padding: '5rem 2rem' },
  emptyTitle: { color: '#555', marginTop: '1rem', fontSize: '1.3rem' },
  emptySub:   { color: '#888', marginBottom: '1.5rem', fontSize: '0.95rem' },
  shopLink:   { display: 'inline-block', padding: '0.75rem 1.8rem', background: '#2c6e49', color: '#fff', borderRadius: '10px', fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem' },
  success:    { background: '#d4edda', color: '#155724', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600' },
  error:      { background: '#f8d7da', color: '#721c24', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1rem' },
  layout:     { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' },
  itemsCol:   { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  item:       { display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', padding: '1rem 1.2rem', borderRadius: '10px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' },
  itemEmoji:  { fontSize: '2rem', flexShrink: 0 },
  itemInfo:   { flex: 1 },
  itemName:   { fontWeight: '700', color: '#1a3c2b', margin: '0 0 0.2rem', fontSize: '0.95rem' },
  itemPrice:  { color: '#888', fontSize: '0.82rem', margin: 0 },
  qtyRow:     { display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0f7f0', padding: '0.3rem 0.6rem', borderRadius: '8px' },
  qtyBtn:     { width: '26px', height: '26px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1rem', color: '#2c6e49', fontWeight: '700' },
  qty:        { minWidth: '22px', textAlign: 'center', fontWeight: '700' },
  subtotal:   { fontWeight: '700', color: '#2c6e49', minWidth: '60px', textAlign: 'right' },
  removeBtn:  { background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem 0.4rem' },
  summary:    { background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', color: '#555', marginBottom: '0.5rem' },
  label:      { display: 'block', fontWeight: '600', color: '#444', fontSize: '0.88rem', margin: '1.2rem 0 0.4rem' },
  textarea:   { width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '7px', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' },
  cod:        { color: '#888', fontSize: '0.82rem', margin: '0.8rem 0' },
  orderBtn:   { width: '100%', padding: '0.85rem', background: '#2c6e49', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', marginBottom: '0.6rem', cursor: 'pointer' },
  clearBtn:   { width: '100%', padding: '0.65rem', background: '#f8d7da', color: '#721c24', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' },
};
