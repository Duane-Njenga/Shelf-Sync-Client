import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import MemberLayout from './layouts/MemberLayout.jsx';

// Member pages
import Account from './pages/Account.jsx';
import Catalogue from './pages/admin/Catalogue.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Register from './pages/Register.jsx';

// Admin pages (inside admin subfolder)
import AuditLogs from './pages/admin/AuditLogs.jsx';
import BooksAdmin from './pages/admin/BooksAdmin.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Fines from './pages/admin/Fines.jsx';
import Loans from './pages/admin/Loans.jsx';
import Members from './pages/admin/Members.jsx';
import Reports from './pages/admin/Reports.jsx';
import Reservations from './pages/admin/Reservations.jsx';
import UsersAndRoles from './pages/admin/UsersAndRoles.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Member Front-End */}
      <Route
        element={
          <ProtectedRoute>
            <MemberLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Catalogue />} />
        <Route path="account" element={<Account />} />
      </Route>

      {/* Admin Panel */}
      <Route
        path="admin"
        element={
          <ProtectedRoute staffOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="books" element={<BooksAdmin />} />
        <Route path="members" element={<Members />} />
        <Route path="issue-return" element={<Loans />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="fines" element={<Fines />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="users" element={<UsersAndRoles />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}