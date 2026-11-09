import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { ordersApi } from '../api/orders';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/format';

export default function CartPage() {
  const { cart, count, subtotal, updateQty, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleOrder = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    if (address.trim().length < 10) {
      setError('Please enter a complete delivery address (at least 10 characters).');
      return;
    }

    setError('');
    setPlacing(true);
    try {
      await ordersApi.create({
        items: cart.map((item) => ({ plantId: item.plantId, quantity: item.quantity })),
        address: address.trim(),
      });
      clearCart();
      showToast('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not place your order. Please try again.'));
    } finally {
      setPlacing(false);
    }
  };

  const handleClear = () => {
    clearCart();
    setConfirmClear(false);
    showToast('Cart cleared.', 'info');
  };

  if (cart.length === 0) {
    return (
      <EmptyState
        icon="🪴"
        title="Your cart is empty"
        description="Browse our plants and add something green to your home."
        action={<Link className="btn btn-primary" to="/">Continue shopping</Link>}
      />
    );
  }

  return (
    <div>
      <h1 className="page-heading">🛒 Your cart</h1>
      <p className="muted page-subtitle">{count} item{count === 1 ? '' : 's'} ready for checkout</p>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <article key={item.plantId} className="card cart-item">
              <div className="cart-item-media">
                {item.image ? (
                  <img src={item.image} alt="" loading="lazy" />
                ) : (
                  <span aria-hidden="true">🌱</span>
                )}
              </div>

              <div className="cart-item-info">
                <h2>{item.name}</h2>
                <p className="muted">{formatCurrency(item.price)} each</p>
                {Number.isFinite(item.stock) && (
                  <p className="hint">{item.stock} in stock</p>
                )}
              </div>

              <div className="qty-control" aria-label={`Quantity for ${item.name}`}>
                <button
                  type="button"
                  onClick={() => updateQty(item.plantId, item.quantity - 1)}
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQty(item.plantId, item.quantity + 1)}
                  disabled={Number.isFinite(item.stock) && item.quantity >= item.stock}
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>

              <p className="cart-item-total">{formatCurrency(item.price * item.quantity)}</p>

              <button
                type="button"
                className="icon-button"
                onClick={() => removeItem(item.plantId)}
                aria-label={`Remove ${item.name} from cart`}
              >
                ✕
              </button>
            </article>
          ))}

          <button type="button" className="btn btn-secondary" onClick={() => setConfirmClear(true)}>
            Clear cart
          </button>
        </div>

        <aside className="card summary">
          <h2>Order summary</h2>

          <div className="summary-row">
            <span>Items ({count})</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className="stock-in">FREE</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="field">
            <label className="label" htmlFor="delivery-address">Delivery address</label>
            <textarea
              id="delivery-address"
              className="textarea"
              rows={3}
              maxLength={300}
              placeholder="House no, street, city, state, PIN code"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
            <p className="hint">{address.length}/300 characters</p>
          </div>

          <p className="hint">💵 Payment method: cash on delivery</p>

          {!user && (
            <div className="alert alert-info">
              Please <Link to="/login" state={{ from: { pathname: '/cart' } }}>sign in</Link> to place your order.
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handleOrder}
            disabled={placing}
          >
            {placing ? 'Placing order...' : user ? 'Place order' : 'Sign in to checkout'}
          </button>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Clear your cart?"
        description="All items will be removed from your cart. This cannot be undone."
        confirmLabel="Clear cart"
        danger
        onConfirm={handleClear}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}
