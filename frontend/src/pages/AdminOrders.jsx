import { useCallback, useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '../api/client';
import { ordersApi } from '../api/orders';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../context/ToastContext';
import { ORDER_STATUSES, ORDER_TRANSITIONS, formatCurrency, formatDate, shortOrderId } from '../utils/format';

export default function AdminOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await ordersApi.all();
      setOrders(data.orders);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load orders.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const counts = useMemo(
    () =>
      orders.reduce(
        (acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        },
        { All: orders.length }
      ),
    [orders]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchesSearch =
        !term ||
        order.userName?.toLowerCase().includes(term) ||
        order._id.toLowerCase().includes(term) ||
        order.address.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  const handleStatusChange = async (order, status) => {
    if (!status) return;
    setUpdatingId(order._id);
    try {
      const { data } = await ordersApi.updateStatus(order._id, status);
      setOrders((current) =>
        current.map((item) => (item._id === order._id ? data.order : item))
      );
      showToast(`Order ${shortOrderId(order._id)} marked as ${status}.`);
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not update the order.'), 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Spinner label="Loading orders..." />;
  if (error) return <ErrorState message={error} onRetry={loadOrders} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-heading">📦 Orders</h1>
          <p className="muted page-subtitle">Move orders through the fulfilment workflow.</p>
        </div>
      </div>

      <div className="filter-bar">
        <input
          className="input"
          type="search"
          placeholder="🔍 Search by customer, order id or address..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search orders"
        />
      </div>

      <div className="pill-row" role="group" aria-label="Filter orders by status">
        {['All', ...ORDER_STATUSES].map((status) => (
          <button
            key={status}
            type="button"
            className={statusFilter === status ? 'pill active' : 'pill'}
            onClick={() => setStatusFilter(status)}
          >
            {status} ({counts[status] || 0})
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          description="New orders will appear here as soon as customers check out."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No orders match your filters"
          description="Try clearing the search or choosing a different status."
          action={
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
              }}
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="stack">
          {filtered.map((order) => {
            const nextStatuses = ORDER_TRANSITIONS[order.status] || [];
            return (
              <article key={order._id} className="card order-card">
                <div className="order-card-header">
                  <div>
                    <p className="order-id">{shortOrderId(order._id)}</p>
                    <p className="muted">
                      👤 {order.userName} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="order-status-control">
                    <StatusBadge status={order.status} />
                    {nextStatuses.length > 0 ? (
                      <select
                        className="select select-sm"
                        value=""
                        onChange={(event) => handleStatusChange(order, event.target.value)}
                        disabled={updatingId === order._id}
                        aria-label={`Update status for order ${shortOrderId(order._id)}`}
                      >
                        <option value="">
                          {updatingId === order._id ? 'Updating...' : 'Update status...'}
                        </option>
                        {nextStatuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="hint">No further actions</span>
                    )}
                  </div>
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
                  <span className="order-total">{formatCurrency(order.total)}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
