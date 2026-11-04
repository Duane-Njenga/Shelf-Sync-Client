import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar Navigation */}
      <aside className="bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px' }}>
        <h2 className="h5 text-shelf fw-bold mb-4">ShelfSync Admin</h2>
        <nav className="nav nav-pills flex-column gap-1 flex-grow-1">
          <NavLink to="/admin" end className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/books" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            Books
          </NavLink>
          <NavLink to="/admin/members" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            Members
          </NavLink>
          <NavLink to="/admin/issue-return" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            Issue & Return
          </NavLink>
          <NavLink to="/admin/reservations" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            Reservations
          </NavLink>
          <NavLink to="/admin/fines" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            Fines
          </NavLink>
          <NavLink to="/admin/reports" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            Reports
          </NavLink>
          <NavLink to="/admin/audit-logs" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            Audit Logs
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            Users & Roles
          </NavLink>
        </nav>

        {/* Member View Switcher Button */}
        <div className="mt-auto pt-3 border-top border-secondary">
          <Link to="/" className="btn btn-outline-warning w-100 mb-2">
            👁️ Member View
          </Link>
          <button className="btn btn-outline-danger w-100" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column">
        <header className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Admin Workspace</span>
          <span className="badge bg-success">{user?.role} Mode ({user?.fullName})</span>
        </header>
        <main className="p-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}