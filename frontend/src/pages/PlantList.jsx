import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PlantList({ onEdit }) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchPlants = async () => {
    setLoading(true);
    const res = await axios.get('/api/plants');
    setPlants(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchPlants(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plant?')) return;
    await axios.delete(`/api/plants/${id}`);
    setMsg('Plant deleted!');
    fetchPlants();
    setTimeout(() => setMsg(''), 2000);
  };

  if (loading) return <p style={s.info}>Loading plants...</p>;

  return (
    <div>
      <h2 style={s.heading}>All Plants ({plants.length})</h2>

      {msg && <p style={s.success}>{msg}</p>}

      {plants.length === 0 ? (
        <p style={s.info}>No plants found. Add some!</p>
      ) : (
        <table style={s.table}>
          <thead>
            <tr>
              {['Name', 'Category', 'Price', 'Stock', 'Description', 'Actions'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plants.map(p => (
              <tr key={p._id} style={s.tr}>
                <td style={s.td}>{p.name}</td>
                <td style={s.td}>{p.category}</td>
                <td style={s.td}>₹{p.price}</td>
                <td style={s.td}>{p.stock}</td>
                <td style={{ ...s.td, color: '#666', fontSize: '0.85rem' }}>
                  {p.description || '—'}
                </td>
                <td style={s.td}>
                  <button onClick={() => onEdit(p)} style={s.editBtn}>Edit</button>
                  <button onClick={() => handleDelete(p._id)} style={s.deleteBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const s = {
  heading: { color: '#2c6e49', marginBottom: '1rem' },
  info:    { color: '#666', padding: '1rem 0' },
  success: { background: '#d4edda', color: '#155724', padding: '0.6rem 1rem', borderRadius: '6px', marginBottom: '1rem' },
  table:   { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  th:      { background: '#2c6e49', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600' },
  tr:      { borderBottom: '1px solid #eee' },
  td:      { padding: '0.75rem 1rem', verticalAlign: 'middle' },
  editBtn:   { padding: '0.3rem 0.8rem', background: '#fff3cd', border: 'none', borderRadius: '5px', marginRight: '0.4rem', fontWeight: '600' },
  deleteBtn: { padding: '0.3rem 0.8rem', background: '#f8d7da', border: 'none', borderRadius: '5px', fontWeight: '600' },
};
