import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from './ConfirmDialog';

function navClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link';
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const homePath = user?.role === 'admin' ? '/admin' : '/';

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    clearCart();
    logout();
    setConfirmLogout(false);
    closeMenu();
    showToast('You have been logged out.', 'info');
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to={homePath} className="brand" onClick={closeMenu}>
          🌿 <span>Nursery Shop</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav
          id="primary-navigation"
          className={`nav-links${menuOpen ? ' open' : ''}`}
          aria-label="Primary"
        >
          {!user && (
            <>
              <NavLink to="/" end className={navClass} onClick={closeMenu}>
                Shop
              </NavLink>
              <NavLink to="/about" className={navClass} onClick={closeMenu}>
                About
              </NavLink>
              <NavLink to="/contact" className={navClass} onClick={closeMenu}>
                Contact
              </NavLink>
              <NavLink to="/login" className={navClass} onClick={closeMenu}>
                Login
              </NavLink>
              <Link to="/register" className="btn btn-light nav-cta" onClick={closeMenu}>
                Create account
              </Link>
            </>
          )}

          {user?.role === 'user' && (
            <>
              <NavLink to="/" end className={navClass} onClick={closeMenu}>
                Shop
              </NavLink>
              <NavLink to="/orders" className={navClass} onClick={closeMenu}>
                My orders
              </NavLink>
              <NavLink to="/about" className={navClass} onClick={closeMenu}>
                About
              </NavLink>
              <NavLink to="/contact" className={navClass} onClick={closeMenu}>
                Contact
              </NavLink>
              <NavLink to="/cart" className={navClass} onClick={closeMenu}>
                Cart{count > 0 && <span className="cart-badge">{count}</span>}
              </NavLink>
              <span className="nav-user">👋 {user.name}</span>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirmLogout(true)}>
                Logout
              </button>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin" end className={navClass} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/plants/new" className={navClass} onClick={closeMenu}>
                Add plant
              </NavLink>
              <NavLink to="/admin/orders" className={navClass} onClick={closeMenu}>
                Orders
              </NavLink>
              <NavLink to="/admin/messages" className={navClass} onClick={closeMenu}>
                Messages
              </NavLink>
              <NavLink to="/" end className={navClass} onClick={closeMenu}>
                View shop
              </NavLink>
              <span className="nav-user">👤 {user.name}</span>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirmLogout(true)}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Log out of your account?"
        description="Your cart will be cleared on this device."
        confirmLabel="Log out"
        danger
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </header>
  );
}
