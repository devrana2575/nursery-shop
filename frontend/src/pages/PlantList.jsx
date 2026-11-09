import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { ordersApi } from '../api/orders';
import { plantsApi } from '../api/plants';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/format';

export default function PlantList() {
  const { showToast } = useToast();
  const [plants, setPlants] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [plantsResponse, statsResponse] = await Promise.all([
        plantsApi.list({ limit: 100, sort: 'name' }),
        ordersApi.stats(),
      ]);
      setPlants(plantsResponse.data.plants);
      setStats(statsResponse.data.stats);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load the dashboard.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return plants;
    return plants.filter(
      (plant) =>
        plant.name.toLowerCase().includes(term) ||
        plant.category.toLowerCase().includes(term)
    );
  }, [plants, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await plantsApi.remove(deleteTarget._id);
      showToast(`${deleteTarget.name} deleted.`, 'info');
      setDeleteTarget(null);
      await loadDashboard();
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not delete the plant.'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Spinner label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={loadDashboard} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-heading">📋 Admin dashboard</h1>
          <p className="muted page-subtitle">Manage inventory, stock levels and orders.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/plants/new">➕ Add plant</Link>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="card stat-card">
            <span className="stat-label">Plants</span>
            <span className="stat-value">{stats.totalPlants}</span>
            <span className="hint">{stats.lowStockPlants} low on stock</span>
          </div>
          <div className="card stat-card">
            <span className="stat-label">Orders</span>
            <span className="stat-value">{stats.totalOrders}</span>
            <span className="hint">{stats.pendingOrders} pending</span>
          </div>
          <div className="card stat-card">
            <span className="stat-label">Confirmed</span>
            <span className="stat-value">{stats.confirmedOrders}</span>
            <span className="hint">{stats.deliveredOrders} delivered</span>
          </div>
          <div className="card stat-card">
            <span className="stat-label">Revenue</span>
            <span className="stat-value">{formatCurrency(stats.revenue)}</span>
            <span className="hint">Delivered orders only</span>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <input
          className="input"
          type="search"
          placeholder="🔍 Search inventory by name or category..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search inventory"
        />
      </div>

      {plants.length === 0 ? (
        <EmptyState
          icon="🌱"
          title="No plants in the catalogue"
          description="Add your first plant to start selling."
          action={<Link className="btn btn-primary" to="/admin/plants/new">Add plant</Link>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No matching plants"
          description="Try a different search term."
          action={
            <button type="button" className="btn btn-secondary" onClick={() => setSearch('')}>
              Clear search
            </button>
          }
        />
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Plant</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th className="align-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((plant) => (
                <tr key={plant._id}>
                  <td>
                    <div className="table-plant">
                      <span className="table-thumb" aria-hidden="true">
                        {plant.image ? <img src={plant.image} alt="" loading="lazy" /> : '🌿'}
                      </span>
                      <div>
                        <strong>{plant.name}</strong>
                        <p className="hint table-desc">{plant.description || 'No description'}</p>
                      </div>
                    </div>
                  </td>
                  <td>{plant.category}</td>
                  <td>{formatCurrency(plant.price)}</td>
                  <td>
                    <span className={plant.stock <= 5 ? 'badge badge-pending' : 'badge badge-neutral'}>
                      {plant.stock}
                    </span>
                  </td>
                  <td>{plant.featured ? '⭐ Yes' : '—'}</td>
                  <td className="align-right">
                    <div className="table-actions">
                      <Link className="btn btn-secondary btn-sm" to={`/admin/plants/${plant._id}/edit`}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(plant)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${deleteTarget?.name || 'this plant'}?`}
        description="This removes the plant from the catalogue. Existing orders keep their saved item details."
        confirmLabel="Delete plant"
        danger
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
