import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/audit-logs')
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">System Audit Logs</h1>
      {loading ? (
        <p className="text-muted">Loading activity logs...</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-3">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Time</th>
                <th>Performed By</th>
                <th>Action</th>
                <th>Target</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-muted text-center py-3">
                    No system activity logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td><small>{new Date(log.createdAt).toLocaleString()}</small></td>
                    <td className="fw-semibold">{log.performer || 'System'}</td>
                    <td><span className="badge bg-dark">{log.action}</span></td>
                    <td><code>{log.target}</code></td>
                    <td><small>{log.details}</small></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}