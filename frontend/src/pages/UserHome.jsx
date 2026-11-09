import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { plantsApi } from '../api/plants';
import { getErrorMessage } from '../api/client';
import CareTipsModal from '../components/CareTipsModal';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Pagination from '../components/Pagination';
import PlantCard from '../components/PlantCard';
import Spinner from '../components/Spinner';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const PAGE_SIZE = 9;

export default function UserHome() {
  const [plants, setPlants] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [carePlant, setCarePlant] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const { cart, addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    Promise.all([plantsApi.featured(), plantsApi.categories()])
      .then(([featuredResponse, categoriesResponse]) => {
        if (!active) return;
        setFeatured(featuredResponse.data.plants);
        setCategories(categoriesResponse.data.categories);
      })
      .catch(() => {
        // Non-critical: the browse section still works without these extras.
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const delay = search ? 350 : 0;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await plantsApi.list({
          search,
          category,
          page,
          limit: PAGE_SIZE,
        });
        if (!active) return;
        setPlants(data.plants);
        setPagination(data.pagination);
        if (data.pagination.pages < page) setPage(1);
      } catch (err) {
        if (active) setError(getErrorMessage(err, 'Could not load plants.'));
      } finally {
        if (active) setLoading(false);
      }
    }, delay);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, category, page, reloadKey]);

  const inCartQty = (plantId) =>
    cart.find((item) => item.plantId === plantId)?.quantity || 0;

  const handleAdd = (plant) => {
    if (plant.stock === 0) {
      showToast(`${plant.name} is out of stock.`, 'warning');
      return;
    }
    const existing = cart.find((item) => item.plantId === plant._id);
    if (existing && existing.quantity >= plant.stock) {
      showToast(`Only ${plant.stock} ${plant.name} available.`, 'warning');
      return;
    }
    addToCart(plant);
    showToast(`${plant.name} added to cart.`);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setPage(1);
  };

  const hasFilters = Boolean(search || category);

  return (
    <div className="stack-lg">
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">🌿 Fresh plants, delivered to your door</span>
          <h1>Bring your home to life with greenery</h1>
          <p>
            Browse hand-picked indoor, outdoor and flowering plants with care guides,
            transparent pricing and cash-on-delivery checkout.
          </p>
          <div className="hero-actions">
            <a className="btn btn-light" href="#browse">Shop plants</a>
            <Link className="btn btn-outline-light" to="/about">Why us?</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">🪴</div>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="featured-heading">
          <div className="section-heading">
            <div>
              <h2 id="featured-heading">🌟 Featured plants</h2>
              <p className="muted">Our most popular picks this week.</p>
            </div>
          </div>
          <div className="plant-grid">
            {featured.map((plant) => (
              <PlantCard
                key={plant._id}
                plant={plant}
                inCartQty={inCartQty(plant._id)}
                onAdd={handleAdd}
                onCareTips={setCarePlant}
              />
            ))}
          </div>
        </section>
      )}

      <section id="browse" aria-labelledby="browse-heading">
        <div className="section-heading">
          <div>
            <h2 id="browse-heading">🌿 Browse all plants</h2>
            <p className="muted">
              {pagination.total} plant{pagination.total === 1 ? '' : 's'} available
            </p>
          </div>
        </div>

        <div className="filter-bar">
          <input
            className="input"
            type="search"
            placeholder="🔍 Search by name, category or description..."
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            aria-label="Search plants"
          />
          <select
            className="select"
            value={category}
            onChange={(event) => handleCategoryChange(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="pill-row" role="group" aria-label="Category filters">
          <button
            type="button"
            className={category === '' ? 'pill active' : 'pill'}
            onClick={() => handleCategoryChange('')}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? 'pill active' : 'pill'}
              onClick={() => handleCategoryChange(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loading && plants.length === 0 && <Spinner label="Loading plants..." />}

        {!loading && error && (
          <ErrorState message={error} onRetry={() => setReloadKey((key) => key + 1)} />
        )}

        {!error && !loading && plants.length === 0 && (
          <EmptyState
            icon="🌵"
            title={hasFilters ? 'No plants match your search' : 'No plants available yet'}
            description={
              hasFilters
                ? 'Try a different search term or clear the filters.'
                : 'Please check back soon — the nursery is restocking.'
            }
            action={
              hasFilters ? (
                <button type="button" className="btn btn-primary" onClick={clearFilters}>
                  Clear filters
                </button>
              ) : null
            }
          />
        )}

        {!error && plants.length > 0 && (
          <>
            <div className="plant-grid">
              {plants.map((plant) => (
                <PlantCard
                  key={plant._id}
                  plant={plant}
                  inCartQty={inCartQty(plant._id)}
                  onAdd={handleAdd}
                  onCareTips={setCarePlant}
                />
              ))}
            </div>
            <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
          </>
        )}
      </section>

      <CareTipsModal plant={carePlant} onClose={() => setCarePlant(null)} />
    </div>
  );
}
