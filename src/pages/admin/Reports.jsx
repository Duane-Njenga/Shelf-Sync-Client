import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Reports() {
  const [reports, setReports] = useState({ popularBooks: [], loansByStatus: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/reports')
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">Library Analytics & Reports</h1>

      {loading ? (
        <p className="text-muted">Loading report analytics...</p>
      ) : (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white fw-bold">Top Borrowed Books</div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  {reports.popularBooks.map((b, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{b.title}</span>
                      <span className="badge bg-primary rounded-pill">{b.loanCount} loans</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white fw-bold">Loans Overview by Status</div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  {reports.loansByStatus.map((s, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{s.status} Loans</span>
                      <span className="badge bg-secondary rounded-pill">{s.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}