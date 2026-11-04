import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/members')
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">Registered Members</h1>
      {loading ? (
        <p className="text-muted">Loading members...</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-3">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Membership No.</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td><code>{m.membershipNo}</code></td>
                  <td className="fw-semibold">{m.fullName}</td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td><span className="badge bg-secondary">{m.role}</span></td>
                  <td>
                    <span className={`badge ${m.status === 'Active' ? 'bg-success' : 'bg-warning'}`}>
                      {m.status}
                    </span>
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