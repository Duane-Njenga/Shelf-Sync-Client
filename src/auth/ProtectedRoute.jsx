import { Navigate, useLocation } from 'react-router-dom';
import { isStaff, useAuth } from './AuthContext.jsx';
import Forbidden from '../pages/Forbidden.jsx';

export default function ProtectedRoute({ staffOnly = false, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="text-center text-muted mt-5">Loading…</p>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (staffOnly && !isStaff(user)) return <Forbidden />;
  return children;
}
