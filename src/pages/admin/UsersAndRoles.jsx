import { useEffect, useState } from 'react';
import { api } from '../../api.js';
import { useAuth } from '../../auth/AuthContext.jsx';

export default function Users() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'Admin';

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    api
      .get('/users')
      .then((res) => {
        setUsers(res.users);
        setRoles(res.roles);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (userId, newRoleId) => {
    if (!isAdmin) return;
    try {
      await api.patch(`/users/${userId}/role`, { roleId: Number(newRoleId) });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 text-shelf fw-bold m-0">System Users & Roles</h1>
        {!isAdmin && (
          <span className="badge bg-secondary">Read-Only (Admin required to edit roles)</span>
        )}
      </div>

      {loading ? (
        <p className="text-muted">Loading users...</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Membership No</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Assigned Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><code>{u.membershipNo}</code></td>
                  <td className="fw-semibold">{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    {isAdmin ? (
                      <select
                        className="form-select form-select-sm"
                        style={{ maxWidth: '160px' }}
                        value={u.roleId}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="badge bg-primary">{u.role}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}