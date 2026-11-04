import { Link, Outlet } from 'react-router-dom';
import { isStaff, useAuth } from '../auth/AuthContext.jsx';

export default function MemberLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Sticky Staff Switcher Banner if User is Admin or Librarian */}
      {isStaff(user) && (
        <div className="bg-dark text-white px-3 py-2 d-flex justify-content-between align-items-center">
          <small>👀 Currently viewing catalog as <strong>Member View</strong></small>
          <Link to="/admin" className="btn btn-sm btn-warning fw-bold">
            ← Switch Back to Admin Dashboard
          </Link>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold text-shelf" to="/">
            ShelfSync
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="text-light small">Welcome, {user?.fullName}</span>
            <Link to="/account" className="btn btn-sm btn-outline-light">
              My Account
            </Link>
            <button className="btn btn-sm btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container my-4 flex-grow-1">
        <Outlet />
      </main>
    </div>
  );
}