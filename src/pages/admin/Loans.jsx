import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/loans')
      .then(setLoans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">Issue & Return Books</h1>
      {loading ? (
        <p className="text-muted">Loading active loans...</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-3">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Copy Barcode</th>
                <th>Book Title</th>
                <th>Member</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => (
                <tr key={l.id}>
                  <td><code>{l.barcode}</code></td>
                  <td className="fw-semibold">{l.title}</td>
                  <td>{l.memberName} ({l.membershipNo})</td>
                  <td>{l.issueDate ? new Date(l.issueDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{l.dueDate ? new Date(l.dueDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`badge ${l.status === 'Active' ? 'bg-primary' : 'bg-success'}`}>
                      {l.status}
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