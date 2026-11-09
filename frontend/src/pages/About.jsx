const STACK = [
  { icon: '🍃', name: 'MongoDB', desc: 'Plants, users, orders and messages with Mongoose schemas and indexes.' },
  { icon: '🚂', name: 'Express.js', desc: 'Layered REST API with validation, JWT middleware and central error handling.' },
  { icon: '⚛️', name: 'React.js', desc: 'Router-based SPA with auth, cart and toast contexts plus a typed API layer.' },
  { icon: '🟢', name: 'Node.js', desc: 'Tested with the built-in test runner and ready for Docker deployment.' },
];

const FEATURES = [
  'JWT authentication with bcrypt password hashing',
  'Role-based access control for customers and admins',
  'Server-side price and stock validation on every order',
  'Atomic stock decrement with automatic rollback',
  'Order lifecycle: Pending → Confirmed → Delivered (or Cancelled)',
  'Search, category filters and pagination on the shop',
  'Admin dashboard with revenue and inventory stats',
  'Contact form persisted to the database',
  'Responsive, accessible UI with loading and error states',
  '30 API tests, CI workflow and Docker Compose setup',
];

export default function About() {
  return (
    <div className="about">
      <section className="hero hero-compact">
        <div className="hero-copy">
          <span className="hero-eyebrow">🌿 About the project</span>
          <h1>A production-minded MERN nursery shop</h1>
          <p>
            This project started as a college mini project and was rebuilt around the
            practices you would expect in a real product team: secure auth, clean
            architecture, automated tests and a deployable setup.
          </p>
        </div>
        <div className="hero-art" aria-hidden="true">🌱</div>
      </section>

      <section className="card content-card">
        <h2>What it does</h2>
        <p>
          Customers can browse the catalogue, filter by category, read plant care guides,
          manage a persistent cart and place cash-on-delivery orders. Admins get a dashboard
          to manage inventory, move orders through a strict status workflow, review revenue
          and read contact messages.
        </p>
        <p>
          Prices and totals are always calculated on the server, and stock is decremented
          atomically so two shoppers can never buy the same last plant.
        </p>
      </section>

      <section className="card content-card">
        <h2>Tech stack</h2>
        <div className="tech-grid">
          {STACK.map((item) => (
            <div key={item.name} className="tech-card">
              <span aria-hidden="true">{item.icon}</span>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card content-card">
        <h2>Engineering highlights</h2>
        <ul className="feature-list">
          {FEATURES.map((feature) => (
            <li key={feature}>✅ {feature}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
