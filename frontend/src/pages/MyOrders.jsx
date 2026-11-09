import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { ordersApi } from '../api/orders';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate, shortOrderId } from '../utils/format';

export default function MyOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await ordersApi.mine();
      setOrders(data.orders);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load your orders.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await ordersApi.cancel(cancelTarget._id);
      showToast('Order cancelled and stock restored.', 'info');
      setCancelTarget(null);
      await loadOrders();
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not cancel the order.'), 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Spinner label="Loading your orders..." />;
  if (error) return <ErrorState message={error} onRetry={loadOrders} />;

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No orders yet"
        description="Once you place an order it will appear here with live status updates."
        action={<Link className="btn btn-primary" to="/">Start shopping</Link>}
      />
    );
  }

  return (
    <div>
      <h1 className="page-heading">📦 My orders</h1>
      <p className="muted page-subtitle">Track every order from pending to delivered.</p>

      <div className="stack">
        {orders.map((order) => (
          <article key={order._id} className="card order-card">
            <div className="order-card-header">
              <div>
                <p className="order-id">{shortOrderId(order._id)}</p>
                <p className="muted">{formatDate(order.createdAt)}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={`${order._id}-${item.plantId}`} className="order-item-row">
                  <span>🌱 {item.name}</span>
                  <span className="muted">×{item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="order-card-footer">
              <span className="muted">📍 {order.address}</span>
              <span className="order-total">Total: {formatCurrency(order.total)}</span>
            </div>

            {order.status === 'Pending' && (
              <div className="order-actions">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => setCancelTarget(order)}
                >
                  Cancel order
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        title="Cancel this order?"
        description="The order will be marked as cancelled and the stock will be returned to the nursery."
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
        danger
        busy={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}
