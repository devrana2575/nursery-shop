import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <p className="footer-brand">🌿 Nursery Shop</p>
          <p className="footer-text">
            A MERN reference project with JWT auth, role-based access, stock-safe ordering,
            API tests and Docker deployment.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Nursery Shop</span>
        <span>Built with MongoDB · Express · React · Node.js</span>
      </div>
    </footer>
  );
}
