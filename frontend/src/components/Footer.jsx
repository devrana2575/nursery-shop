export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <div style={s.brand}>🌿 Online Nursery Shop</div>
        <div style={s.divider} />
        <p style={s.text}>Developed by Dev &nbsp;|&nbsp; MCA Mini Project 2026</p>
        <p style={s.text2}>© {new Date().getFullYear()} GreenPlants Nursery. All rights reserved.</p>
      </div>
    </footer>
  );
}

const s = {
  footer: { background: '#1a3c2b', color: '#a8d8a8', marginTop: 'auto', padding: '1.5rem 2rem' },
  inner:  { maxWidth: '980px', margin: '0 auto', textAlign: 'center' },
  brand:  { fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.4rem' },
  divider:{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.6rem 0' },
  text:   { margin: '0.2rem 0', fontSize: '0.88rem', color: '#a8d8a8' },
  text2:  { margin: '0.2rem 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' },
};
