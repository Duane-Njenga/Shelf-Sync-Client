import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function UsersAndRoles() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    api
      .get('/users')
      .then((data) => {
        setUsers(data.users);
        setRoles(data.roles);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (userId, roleId) => {
    try {
      await api.patch(`/users/${userId}/role`, { roleId });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">User & Role Management</h1>

      {loading ? (
        <p className="text-muted">Loading permissions...</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-3">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Membership No</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Assigned Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><code>{u.membershipNo}</code></td>
                  <td className="fw-semibold">{u.fullName}</td>
                  <td>{u.email}</td>
                  <td><span className="badge bg-primary">{u.role}</span></td>
                  <td>
                    <select
                      className="form-select form-select-sm w-auto"
                      value={u.roleId}
                      onChange={(e) => handleRoleChange(u.id, Number(e.target.value))}
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
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