import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import MemberLayout from './layouts/MemberLayout.jsx';
import Account from './pages/Account.jsx';
import ComingSoon from './pages/ComingSoon.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Register from './pages/Register.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Member front-end */}
      <Route
        element={
          <ProtectedRoute>
            <MemberLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ComingSoon title="Catalogue" />} />
        <Route path="account" element={<Account />} />
        <Route path="help" element={<ComingSoon title="Help" />} />
      </Route>

      {/* Admin panel (Librarian and Admin) */}
      <Route
        path="admin"
        element={
          <ProtectedRoute staffOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ComingSoon title="Dashboard" />} />
        <Route path="books" element={<ComingSoon title="Manage Books" />} />
        <Route path="members" element={<ComingSoon title="Members" />} />
        <Route path="issue-return" element={<ComingSoon title="Issue / Return Books" />} />
        <Route path="reservations" element={<ComingSoon title="Reservations" />} />
        <Route path="fines" element={<ComingSoon title="Fines" />} />
        <Route path="reports" element={<ComingSoon title="Reports" />} />
        <Route path="audit-logs" element={<ComingSoon title="Audit Logs" />} />
        <Route path="users" element={<ComingSoon title="Users & Roles" />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
