export default function About() {
  return (
    <div style={s.wrap}>

      <div style={s.hero}>
        <div style={s.heroEmoji}>🌿</div>
        <h1 style={s.heroTitle}>About GreenPlants Nursery</h1>
        <p style={s.heroSub}>
          A MERN stack web application built to simplify online plant purchasing and nursery management.
        </p>
      </div>

      <div style={s.section}>
        <h2 style={s.sectionTitle}>📖 About This Project</h2>
        <p style={s.text}>
          <strong>GreenPlants Nursery</strong> is a full-stack web application developed using the MERN stack
          (MongoDB, Express.js, React.js, Node.js). The project was built as a mini project to demonstrate
          core concepts of web development including user authentication, CRUD operations, and REST APIs.
        </p>
        <p style={s.text}>
          The platform allows users to browse plants, add them to a cart, and place orders online.
          Admins can manage the plant inventory and update order statuses through a separate dashboard.
        </p>
      </div>

      <div style={s.section}>
        <h2 style={s.sectionTitle}>⚙️ Tech Stack</h2>
        <div style={s.techGrid}>
          {[
            { icon: '🍃', name: 'MongoDB', desc: 'NoSQL database to store plants, users and orders' },
            { icon: '🚂', name: 'Express.js', desc: 'Backend framework for building REST APIs' },
            { icon: '⚛️', name: 'React.js', desc: 'Frontend library for building the user interface' },
            { icon: '🟢', name: 'Node.js', desc: 'JavaScript runtime for the server side' },
          ].map(t => (
            <div key={t.name} style={s.techCard}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.icon}</div>
              <div style={s.techName}>{t.name}</div>
              <div style={s.techDesc}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.section}>
        <h2 style={s.sectionTitle}>✅ Key Features</h2>
        <ul style={s.list}>
          {[
            'User Registration and Login',
            'Browse plants with Search and Category Filter',
            'Featured Plants section on home page',
            'Plant Care Tips for each plant',
            'Add to Cart and Place Orders',
            'My Orders — track your order history',
            'Admin Panel — Add, Edit, Delete plants',
            'Admin can manage and update order status',
          ].map(f => (
            <li key={f} style={s.listItem}>✅ {f}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}

const s = {
  wrap:        { maxWidth: '760px', margin: '0 auto' },
  hero:        { background: 'linear-gradient(135deg, #2c6e49, #52b788)', borderRadius: '14px', padding: '2.5rem', textAlign: 'center', marginBottom: '2rem', color: '#fff' },
  heroEmoji:   { fontSize: '3.5rem', marginBottom: '0.5rem' },
  heroTitle:   { fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.6rem' },
  heroSub:     { opacity: 0.9, fontSize: '1rem', maxWidth: '500px', margin: '0 auto' },
  section:     { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  sectionTitle:{ color: '#2c6e49', marginBottom: '1rem', fontSize: '1.2rem' },
  text:        { color: '#555', lineHeight: 1.8, marginBottom: '0.8rem', fontSize: '0.95rem' },
  techGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' },
  techCard:    { background: '#f0faf0', borderRadius: '10px', padding: '1rem', textAlign: 'center', border: '1px solid #c8e6c9' },
  techName:    { fontWeight: '700', color: '#1a3c2b', marginBottom: '0.3rem' },
  techDesc:    { fontSize: '0.8rem', color: '#666' },
  list:        { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  listItem:    { fontSize: '0.95rem', color: '#444', padding: '0.5rem 0.8rem', background: '#f9f9f9', borderRadius: '6px' },
};
