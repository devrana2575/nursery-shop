export default function Toast({ msg, type = 'success' }) {
  const bg = type === 'error' ? '#e74c3c' : '#27ae60';
  return (
    <div style={{ ...s.toast, background: bg }}>
      {msg}
    </div>
  );
}

const s = {
  toast: {
    position: 'fixed', top: '1rem', right: '1rem', zIndex: 3000,
    color: '#fff', padding: '0.75rem 1.3rem', borderRadius: '10px',
    fontWeight: '600', fontSize: '0.95rem',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    animation: 'fadeIn 0.3s ease',
  },
};
