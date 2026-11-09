import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-state">
      <p className="notfound-code">404</p>
      <div className="empty-icon" aria-hidden="true">🌵</div>
      <h1>Page not found</h1>
      <p>The page you are looking for wandered off into the wild.</p>
      <Link className="btn btn-primary" to="/">Back to the shop</Link>
    </div>
  );
}
