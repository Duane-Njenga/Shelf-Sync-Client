import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const MENU = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/books', label: 'Books' },
  { to: '/admin/members', label: 'Members' },
  { to: '/admin/issue-return', label: 'Issue / Return' },
  { to: '/admin/reservations', label: 'Reservations' },
  { to: '/admin/fines', label: 'Fines' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/audit-logs', label: 'Audit Logs', adminOnly: true },
  { to: '/admin/users', label: 'Users & Roles', adminOnly: true },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const items = MENU.filter((item) => !item.adminOnly || user?.role === 'Admin');

  return (
    <>
      <nav className="navbar bg-shelf navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/admin">
            ShelfSync Admin
          </Link>
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3">
              {user?.role}: {user?.fullName?.split(' ')[0]}
            </span>
            <Link to="/" className="btn btn-sm btn-outline-light me-2">
              Member view
            </Link>
            <button type="button" className="btn btn-sm btn-outline-light" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="d-flex">
        <aside className="admin-sidebar flex-shrink-0">
          <ul className="nav flex-column">
            {items.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink className="nav-link" to={item.to} end={item.end}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
    </>
  );
}
