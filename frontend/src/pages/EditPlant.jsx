import { useState } from 'react';
import axios from 'axios';

export default function EditPlant({ plant, onSuccess }) {
  const [form, setForm] = useState({
    name:        plant.name        || '',
    category:    plant.category    || 'Indoor',
    price:       plant.price       || '',
    stock:       plant.stock       || '',
    description: plant.description || '',
    image:       plant.image       || '',
    featured:    plant.featured    || false,
    careTips: {
      water:      plant.careTips?.water      || '',
      sunlight:   plant.careTips?.sunlight   || '',
      fertilizer: plant.careTips?.fertilizer || ''
    }
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCareTips = e => setForm({ ...form, careTips: { ...form.careTips, [e.target.name]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`/api/plants/${plant._id}`, form);
      setMsg('Plant updated!');
      setTimeout(() => onSuccess(), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={s.wrap}>
      <h2 style={s.heading}>✏️ Edit Plant — {plant.name}</h2>
      {msg   && <p style={s.success}>{msg}</p>}
      {error && <p style={s.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.row}>
          <div style={s.field}>
            <label style={s.label}>Plant Name</label>
            <input style={s.input} name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Category</label>
            <select style={s.input} name="category" value={form.category} onChange={handleChange}>
              {['Indoor', 'Outdoor', 'Succulents', 'Herbs', 'Flowering'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={s.row}>
          <div style={s.field}>
            <label style={s.label}>Price (₹)</label>
            <input style={s.input} name="price" type="number" value={form.price} onChange={handleChange} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Stock</label>
            <input style={s.input} name="stock" type="number" value={form.stock} onChange={handleChange} required />
          </div>
        </div>

        <div style={s.field}>
          <label style={s.label}>Image URL</label>
          <input style={s.input} name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
        </div>

        <div style={s.field}>
          <label style={s.label}>Description</label>
          <textarea style={{ ...s.input, resize: 'vertical' }} name="description" rows={3} value={form.description} onChange={handleChange} />
        </div>

        <div style={s.field}>
          <label style={{ ...s.label, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
            Mark as Featured
          </label>
        </div>

        <div style={s.careTipsBox}>
          <h4 style={s.careHeading}>🌱 Care Tips</h4>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>💧 Watering</label>
              <input style={s.input} name="water" value={form.careTips.water} onChange={handleCareTips} placeholder="e.g. Once a week" />
            </div>
            <div style={s.field}>
              <label style={s.label}>☀️ Sunlight</label>
              <input style={s.input} name="sunlight" value={form.careTips.sunlight} onChange={handleCareTips} placeholder="e.g. 4-5 hours" />
            </div>
            <div style={s.field}>
              <label style={s.label}>🌾 Fertilizer</label>
              <input style={s.input} name="fertilizer" value={form.careTips.fertilizer} onChange={handleCareTips} placeholder="e.g. Once a month" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button type="submit" style={s.btn}>Update Plant</button>
          <button type="button" style={s.cancelBtn} onClick={onSuccess}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

const s = {
  wrap:       { background: '#fff', borderRadius: '12px', padding: '1.8rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  heading:    { color: '#2c6e49', marginBottom: '1.2rem' },
  form:       { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row:        { display: 'flex', gap: '1rem' },
  field:      { display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 },
  label:      { fontSize: '0.85rem', fontWeight: '600', color: '#444' },
  input:      { padding: '0.6rem 0.9rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', width: '100%' },
  careTipsBox:{ background: '#f0faf0', borderRadius: '10px', padding: '1rem', border: '1px solid #c8e6c9' },
  careHeading:{ color: '#2c6e49', marginBottom: '0.8rem', fontSize: '1rem' },
  btn:        { padding: '0.7rem 2rem', background: '#2c6e49', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '1rem' },
  cancelBtn:  { padding: '0.7rem 1.5rem', background: '#f5f5f5', color: '#555', border: 'none', borderRadius: '8px', fontWeight: '600' },
  success:    { background: '#d4edda', color: '#155724', padding: '0.6rem 1rem', borderRadius: '6px' },
  error:      { background: '#f8d7da', color: '#721c24', padding: '0.6rem 1rem', borderRadius: '6px' },
};
