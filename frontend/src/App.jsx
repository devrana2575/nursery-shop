import { useState, useEffect } from 'react';
import Login       from './pages/Login';
import Register    from './pages/Register';
import UserHome    from './pages/UserHome';
import CartPage    from './pages/CartPage';
import MyOrders    from './pages/MyOrders';
import PlantList   from './pages/PlantList';
import AddPlant    from './pages/AddPlant';
import EditPlant   from './pages/EditPlant';
import AdminOrders from './pages/AdminOrders';
import About       from './pages/About';
import Contact     from './pages/Contact';
import NotFound    from './pages/NotFound';
import Footer      from './components/Footer';
import Toast       from './components/Toast';

export default function App() {
  // ── Restore session from localStorage ──
  const [user, setUser]                 = useState(() => {
    try { return JSON.parse(localStorage.getItem('nursery_user')) || null; } catch { return null; }
  });
  const [page, setPage]                 = useState(() => {
    const saved = localStorage.getItem('nursery_user');
    if (!saved) return 'login';
    try {
      const u = JSON.parse(saved);
      return u.role === 'admin' ? 'list' : 'shop';
    } catch { return 'login'; }
  });
  const [cart, setCart]                 = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toast, setToast]               = useState(null); // { msg, type }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Cart helpers ──
  const addToCart = (plant) => {
    setCart(prev => {
      const exists = prev.find(i => i.plantId === plant._id);
      if (exists) return prev.map(i => i.plantId === plant._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { plantId: plant._id, name: plant.name, price: plant.price, quantity: 1 }];
    });
    showToast(`✅ ${plant.name} added to cart`);
  };

  const updateQty = (plantId, qty) => {
    if (qty < 1) return setCart(prev => prev.filter(i => i.plantId !== plantId));
    setCart(prev => prev.map(i => i.plantId === plantId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // ── Auth ──
  const handleLogin = (u) => {
    localStorage.setItem('nursery_user', JSON.stringify(u));
    setUser(u);
    setPage(u.role === 'admin' ? 'list' : 'shop');
    showToast(`✅ Welcome back, ${u.name}!`);
  };

  const confirmLogout = () => setShowLogoutConfirm(true);

  const handleLogout = () => {
    localStorage.removeItem('nursery_user');
    setUser(null);
    setPage('login');
    setCart([]);
    setShowLogoutConfirm(false);
  };

  // ── Not logged in ──
  if (!user) return (
    <div style={s.wrapper}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <nav style={s.nav}>
        <span style={s.brand}>🌿 Nursery Shop</span>
        <div style={s.tabs}>
          <button onClick={() => setPage('login')}    style={page === 'login'    ? s.active : s.tab}>Login</button>
          <button onClick={() => setPage('register')} style={page === 'register' ? s.active : s.tab}>Register</button>
          <button onClick={() => setPage('about')}    style={page === 'about'    ? s.active : s.tab}>About</button>
          <button onClick={() => setPage('contact')}  style={page === 'contact'  ? s.active : s.tab}>Contact</button>
        </div>
      </nav>
      <div style={s.content}>
        {page === 'login'    && <Login    onLogin={handleLogin} goToRegister={() => setPage('register')} showToast={showToast} />}
        {page === 'register' && <Register onRegister={handleLogin} goToLogin={() => setPage('login')} showToast={showToast} />}
        {page === 'about'    && <About />}
        {page === 'contact'  && <Contact />}
      </div>
      <Footer />
    </div>
  );

  // ── User layout ──
  if (user.role === 'user') return (
    <div style={s.wrapper}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {showLogoutConfirm && <LogoutModal onCancel={() => setShowLogoutConfirm(false)} onConfirm={handleLogout} />}
      <nav style={s.nav}>
        <span style={s.brand}>🌿 Nursery Shop</span>
        <div style={s.tabs}>
          <button onClick={() => setPage('shop')}    style={page === 'shop'    ? s.active : s.tab}>🏠 Home</button>
          <button onClick={() => setPage('about')}   style={page === 'about'   ? s.active : s.tab}>About</button>
          <button onClick={() => setPage('contact')} style={page === 'contact' ? s.active : s.tab}>Contact</button>
          <button onClick={() => setPage('orders')}  style={page === 'orders'  ? s.active : s.tab}>My Orders</button>
          <button onClick={() => setPage('cart')}    style={page === 'cart'    ? s.active : s.cartBtn}>
            🛒 Cart {cartCount > 0 && <span style={s.badge}>{cartCount}</span>}
          </button>
          <span style={s.welcome}>👋 {user.name}</span>
          <button onClick={confirmLogout} style={s.logout}>Logout</button>
        </div>
      </nav>
      <div style={s.content}>
        {page === 'shop'    && <UserHome addToCart={addToCart} cart={cart} />}
        {page === 'cart'    && <CartPage cart={cart} updateQty={updateQty} clearCart={clearCart} user={user} onOrderPlaced={() => { clearCart(); setPage('orders'); showToast('✅ Order placed successfully!'); }} />}
        {page === 'orders'  && <MyOrders user={user} />}
        {page === 'about'   && <About />}
        {page === 'contact' && <Contact />}
        {!['shop','cart','orders','about','contact'].includes(page) && <NotFound goHome={() => setPage('shop')} />}
      </div>
      <Footer />
    </div>
  );

  // ── Admin layout ──
  return (
    <div style={s.wrapper}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {showLogoutConfirm && <LogoutModal onCancel={() => setShowLogoutConfirm(false)} onConfirm={handleLogout} />}
      <nav style={s.nav}>
        <span style={s.brand}>🌿 Nursery Admin</span>
        <div style={s.tabs}>
          <button onClick={() => setPage('list')}        style={page === 'list'        ? s.active : s.tab}>📋 Dashboard</button>
          <button onClick={() => setPage('list')}        style={page === 'list'        ? s.active : s.tab} hidden>Manage Plants</button>
          <button onClick={() => setPage('add')}         style={page === 'add'         ? s.active : s.tab}>➕ Add Plant</button>
          <button onClick={() => setPage('adminOrders')} style={page === 'adminOrders' ? s.active : s.tab}>📦 Orders</button>
          <span style={s.welcome}>👤 {user.name}</span>
          <button onClick={confirmLogout} style={s.logout}>Logout</button>
        </div>
      </nav>
      <div style={s.content}>
        {page === 'list'        && <PlantList onEdit={(p) => { setEditingPlant(p); setPage('edit'); }} showToast={showToast} />}
        {page === 'add'         && <AddPlant  onSuccess={() => { setPage('list'); showToast('✅ Plant added successfully!'); }} />}
        {page === 'edit'        && <EditPlant plant={editingPlant} onSuccess={() => { setPage('list'); showToast('✅ Plant updated!'); }} />}
        {page === 'adminOrders' && <AdminOrders showToast={showToast} />}
        {!['list','add','edit','adminOrders'].includes(page) && <NotFound goHome={() => setPage('list')} />}
      </div>
      <Footer />
    </div>
  );
}

function LogoutModal({ onCancel, onConfirm }) {
  return (
    <div style={m.overlay}>
      <div style={m.modal}>
        <div style={m.icon}>🚪</div>
        <h3 style={m.title}>Are you sure you want to logout?</h3>
        <p style={m.sub}>Your cart will be cleared on logout.</p>
        <div style={m.btnRow}>
          <button style={m.cancel} onClick={onCancel}>Cancel</button>
          <button style={m.confirm} onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  );
}

const m = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal:   { background: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '360px', width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
  icon:    { fontSize: '3rem', marginBottom: '0.5rem' },
  title:   { color: '#1a3c2b', marginBottom: '0.5rem', fontSize: '1.1rem' },
  sub:     { color: '#888', fontSize: '0.88rem', marginBottom: '1.5rem' },
  btnRow:  { display: 'flex', gap: '0.8rem', justifyContent: 'center' },
  cancel:  { padding: '0.7rem 1.6rem', background: '#f0f0f0', color: '#444', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' },
  confirm: { padding: '0.7rem 1.6rem', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' },
};

const s = {
  wrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  nav:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 2rem', background: '#2c6e49', color: '#fff', flexWrap: 'wrap', gap: '0.5rem' },
  brand:   { fontSize: '1.3rem', fontWeight: '700', letterSpacing: '-0.3px' },
  tabs:    { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  tab:     { padding: '0.45rem 1.1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.35)', color: '#d4edda', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer' },
  active:  { padding: '0.45rem 1.1rem', background: '#a8d8a8', border: '1px solid #a8d8a8', color: '#1a3c2b', borderRadius: '6px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' },
  cartBtn: { padding: '0.45rem 1.1rem', background: '#52b788', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' },
  badge:   { background: '#e74c3c', color: '#fff', borderRadius: '50%', fontSize: '0.7rem', padding: '0.1rem 0.4rem', marginLeft: '4px' },
  welcome: { color: '#d4edda', fontSize: '0.88rem', padding: '0 0.3rem' },
  logout:  { padding: '0.45rem 1rem', background: '#e74c3c', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: '600', fontSize: '0.88rem', cursor: 'pointer' },
  content: { maxWidth: '980px', margin: '2rem auto', padding: '0 1rem', flex: 1, width: '100%', boxSizing: 'border-box' },
};
