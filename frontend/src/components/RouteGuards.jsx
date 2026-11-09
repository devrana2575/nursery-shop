import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

export function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner label="Checking your session..." />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner label="Checking your session..." />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  return <Outlet />;
}
