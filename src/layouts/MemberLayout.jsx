import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function MemberLayout() {
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="navbar navbar-expand bg-shelf navbar-dark">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            ShelfSync
          </Link>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Catalogue
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/account">
                My Account
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/help">
                Help
              </NavLink>
            </li>
          </ul>
          <span className="navbar-text me-3">Hi, {user?.fullName?.split(' ')[0]}</span>
          <button type="button" className="btn btn-sm btn-outline-light" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}
