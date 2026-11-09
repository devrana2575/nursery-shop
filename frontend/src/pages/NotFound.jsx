export default function NotFound({ goHome }) {
  return (
    <div style={s.wrap}>
      <div style={s.code}>404</div>
      <div style={s.emoji}>🌵</div>
      <h2 style={s.title}>Page Not Found</h2>
      <p style={s.sub}>Looks like this page wandered off into the wild.</p>
      <button style={s.btn} onClick={goHome}>🏠 Go Home</button>
    </div>
  );
}

const s = {
  wrap:  { textAlign: 'center', padding: '5rem 2rem' },
  code:  { fontSize: '6rem', fontWeight: '900', color: '#e0e0e0', lineHeight: 1 },
  emoji: { fontSize: '3rem', margin: '0.5rem 0' },
  title: { color: '#2c6e49', fontSize: '1.5rem', marginBottom: '0.5rem' },
  sub:   { color: '#888', marginBottom: '1.5rem', fontSize: '0.95rem' },
  btn:   { padding: '0.75rem 2rem', background: '#2c6e49', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' },
};
