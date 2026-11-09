import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserHome({ addToCart, cart }) {
  const [plants, setPlants]       = useState([]);
  const [featured, setFeatured]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('');
  const [added, setAdded]         = useState('');
  const [careTipsPlant, setCareTipsPlant] = useState(null); // plant whose tips are shown

  useEffect(() => {
    axios.get('/api/plants').then(r => { setPlants(r.data); setLoading(false); });
    axios.get('/api/plants/featured').then(r => setFeatured(r.data));
  }, []);

  const categories = [...new Set(plants.map(p => p.category))];
  const filtered = plants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category ? p.category === category : true)
  );

  const handleAdd = (plant) => {
    addToCart(plant);
    setAdded(plant._id);
    setTimeout(() => setAdded(''), 1500);
  };

  const inCart = (id) => cart.find(i => i.plantId === id);

  if (loading) return <p style={{ color: '#888', padding: '2rem' }}>Loading plants...</p>;

  return (
    <div>

      {/* ── FEATURED SECTION ── */}
      {featured.length > 0 && (
        <div style={s.featuredSection}>
          <h2 style={s.featuredHeading}>🌟 Featured Plants</h2>
          <p style={s.featuredSub}>Our most popular picks this week</p>
          <div style={s.featuredGrid}>
            {featured.map(p => (
              <div key={p._id} style={s.featuredCard}>
                {p.image
                  ? <img
                      src={p.image}
                      alt={p.name}
                      style={s.featuredImg}
                      onError={e => { e.target.onerror = null; e.target.style.cssText = 'width:100%;height:130px;background:#e8f5e9;display:flex;align-items:center;justify-content:center'; e.target.replaceWith(Object.assign(document.createElement('div'), {style:'width:100%;height:130px;background:#e8f5e9;display:flex;align-items:center;justify-content:center;font-size:2.5rem', textContent:'🌿'})); }}
                    />
                  : <div style={{width:'100%',height:'130px',background:'#e8f5e9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem'}}>🌿</div>
                }
                <div style={s.featuredBody}>
                  <h4 style={s.featuredName}>{p.name}</h4>
                  <span style={s.badge}>{p.category}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                    <span style={s.price}>₹{p.price}</span>
                    <button style={s.addBtn} onClick={() => handleAdd(p)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BROWSE ALL ── */}
      <h2 style={s.heading}>🌿 Browse All Plants</h2>

      {/* Search + filter */}
      <div style={s.filterRow}>
        <input
          style={s.search}
          placeholder="🔍 Search plants..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={s.select} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div style={s.pillRow}>
        <button style={category === '' ? s.pillActive : s.pill} onClick={() => setCategory('')}>All</button>
        {categories.map(c => (
          <button key={c} style={category === c ? s.pillActive : s.pill} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <p style={{ color: '#888', textAlign: 'center', marginTop: '3rem' }}>No plants found.</p>
        : <div style={s.grid}>
            {filtered.map(p => {
              const justAdded  = added === p._id;
              const cartQty    = inCart(p._id)?.quantity || 0;
              const outOfStock = p.stock === 0;
              return (
                <div key={p._id} style={s.card}>
                  {p.image
                    ? <img
                        src={p.image}
                        alt={p.name}
                        style={s.cardImg}
                        onError={e => { e.target.onerror = null; e.target.replaceWith(Object.assign(document.createElement('div'), {style:'width:100%;height:150px;background:#e8f5e9;display:flex;align-items:center;justify-content:center;font-size:3rem', textContent:'🌿'})); }}
                      />
                    : <div style={{width:'100%',height:'150px',background:'#e8f5e9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem'}}>🌿</div>
                  }
                  <div style={s.body}>
                    <div style={s.topRow}>
                      <h3 style={s.name}>{p.name}</h3>
                      <span style={s.badge}>{p.category}</span>
                    </div>
                    <p style={s.desc}>{p.description || 'No description.'}</p>
                    <div style={s.footer}>
                      <span style={s.price}>₹{p.price}</span>
                      <span style={{ color: outOfStock ? '#e74c3c' : '#27ae60', fontSize: '0.8rem', fontWeight: '600' }}>
                        {outOfStock ? 'Out of stock' : `${p.stock} left`}
                      </span>
                    </div>
                    {cartQty > 0 && !outOfStock && (
                      <p style={s.inCartNote}>✓ {cartQty} in cart</p>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                      <button
                        style={outOfStock ? s.disabledBtn : justAdded ? s.addedBtn : s.addBtn}
                        onClick={() => !outOfStock && handleAdd(p)}
                        disabled={outOfStock}
                      >
                        {outOfStock ? 'Out of Stock' : justAdded ? '✓ Added!' : 'Add to Cart'}
                      </button>
                      <button style={s.careBtn} onClick={() => setCareTipsPlant(p)}>
                        🌱 Care Tips
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      }

      {/* ── CARE TIPS MODAL ── */}
      {careTipsPlant && (
        <div style={s.overlay} onClick={() => setCareTipsPlant(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={{ margin: 0, color: '#1a3c2b' }}>🌱 Care Guide — {careTipsPlant.name}</h3>
              <button onClick={() => setCareTipsPlant(null)} style={s.closeBtn}>✕</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.tipRow}>
                <span style={s.tipIcon}>💧</span>
                <div>
                  <div style={s.tipLabel}>Watering</div>
                  <div style={s.tipValue}>{careTipsPlant.careTips?.water || 'Not specified'}</div>
                </div>
              </div>
              <div style={s.tipRow}>
                <span style={s.tipIcon}>☀️</span>
                <div>
                  <div style={s.tipLabel}>Sunlight</div>
                  <div style={s.tipValue}>{careTipsPlant.careTips?.sunlight || 'Not specified'}</div>
                </div>
              </div>
              <div style={s.tipRow}>
                <span style={s.tipIcon}>🌾</span>
                <div>
                  <div style={s.tipLabel}>Fertilizer</div>
                  <div style={s.tipValue}>{careTipsPlant.careTips?.fertilizer || 'Not specified'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  // featured
  featuredSection: { background: '#f0faf0', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #c8e6c9' },
  featuredHeading: { color: '#2c6e49', marginBottom: '0.2rem', fontSize: '1.3rem' },
  featuredSub:     { color: '#888', fontSize: '0.88rem', marginBottom: '1.2rem' },
  featuredGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  featuredCard:    { background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  featuredImg:     { width: '100%', height: '130px', objectFit: 'cover' },
  featuredBody:    { padding: '0.75rem' },
  featuredName:    { margin: '0 0 0.3rem', color: '#1a3c2b', fontSize: '0.95rem', fontWeight: '700' },
  // general
  heading:    { color: '#2c6e49', marginBottom: '1.2rem', fontSize: '1.4rem' },
  filterRow:  { display: 'flex', gap: '0.8rem', marginBottom: '0.8rem' },
  search:     { flex: 1, padding: '0.6rem 1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem' },
  select:     { padding: '0.6rem 1rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', background: '#fff' },
  pillRow:    { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' },
  pill:       { padding: '0.3rem 0.9rem', border: '1px solid #ccc', borderRadius: '20px', background: '#fff', color: '#555', fontSize: '0.85rem', cursor: 'pointer' },
  pillActive: { padding: '0.3rem 0.9rem', border: '1px solid #2c6e49', borderRadius: '20px', background: '#2c6e49', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.2rem' },
  card:       { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' },
  cardImg:    { width: '100%', height: '150px', objectFit: 'cover' },
  body:       { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1 },
  topRow:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem' },
  name:       { color: '#1a3c2b', fontWeight: '700', fontSize: '1rem', margin: 0 },
  badge:      { background: '#e8f5e9', color: '#2c6e49', padding: '0.15rem 0.5rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '600', whiteSpace: 'nowrap' },
  desc:       { color: '#777', fontSize: '0.82rem', lineHeight: 1.5, flexGrow: 1 },
  footer:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price:      { color: '#2c6e49', fontWeight: '800', fontSize: '1.1rem' },
  inCartNote: { color: '#2c6e49', fontSize: '0.78rem', margin: 0, fontWeight: '600' },
  addBtn:     { flex: 1, padding: '0.5rem', background: '#2c6e49', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem' },
  addedBtn:   { flex: 1, padding: '0.5rem', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem' },
  disabledBtn:{ flex: 1, padding: '0.5rem', background: '#eee', color: '#aaa', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem' },
  careBtn:    { padding: '0.5rem 0.7rem', background: '#e8f5e9', color: '#2c6e49', border: '1px solid #c8e6c9', borderRadius: '8px', fontWeight: '600', fontSize: '0.82rem', whiteSpace: 'nowrap' },
  // modal
  overlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal:      { background: '#fff', borderRadius: '14px', width: '360px', maxWidth: '90vw', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' },
  modalHeader:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.2rem', borderBottom: '1px solid #eee' },
  closeBtn:   { background: '#f5f5f5', border: 'none', borderRadius: '6px', padding: '0.2rem 0.6rem', cursor: 'pointer', fontSize: '1rem', color: '#555' },
  modalBody:  { padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  tipRow:     { display: 'flex', alignItems: 'flex-start', gap: '0.8rem', background: '#f9fbe7', borderRadius: '8px', padding: '0.75rem' },
  tipIcon:    { fontSize: '1.6rem', lineHeight: 1 },
  tipLabel:   { fontSize: '0.78rem', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tipValue:   { fontSize: '0.95rem', color: '#1a3c2b', fontWeight: '600', marginTop: '0.15rem' },
};
