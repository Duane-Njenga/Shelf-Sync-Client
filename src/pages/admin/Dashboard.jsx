import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalBooks: 0, activeLoans: 0, totalMembers: 0, unpaidFines: 0 });

  useEffect(() => {
    api.get('/stats').then(setStats).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">Librarian Dashboard</h1>
      <div className="row g-4 mb-4">
        {/* Card 1: Total Catalog Books */}
        <div className="col-md-3">
          <div className="card text-white shadow-sm p-3 border-0" style={{ backgroundColor: '#1e3a8a' }}>
            <div className="card-body">
              <h6 className="card-title text-uppercase small opacity-75">Total Catalog Books</h6>
              <h2 className="display-6 fw-bold m-0">{stats.totalBooks}</h2>
            </div>
          </div>
        </div>

        {/* Card 2: Active Book Loans */}
        <div className="col-md-3">
          <div className="card text-white shadow-sm p-3 border-0" style={{ backgroundColor: '#0f766e' }}>
            <div className="card-body">
              <h6 className="card-title text-uppercase small opacity-75">Active Book Loans</h6>
              <h2 className="display-6 fw-bold m-0">{stats.activeLoans}</h2>
            </div>
          </div>
        </div>

        {/* Card 3: Registered Members */}
        <div className="col-md-3">
          <div className="card text-white shadow-sm p-3 border-0" style={{ backgroundColor: '#4338ca' }}>
            <div className="card-body">
              <h6 className="card-title text-uppercase small opacity-75">Registered Members</h6>
              <h2 className="display-6 fw-bold m-0">{stats.totalMembers}</h2>
            </div>
          </div>
        </div>

        {/* Card 4: Unpaid Fines */}
        <div className="col-md-3">
          <div className="card text-white shadow-sm p-3 border-0" style={{ backgroundColor: '#b91c1c' }}>
            <div className="card-body">
              <h6 className="card-title text-uppercase small opacity-75">Unpaid Fines (KES)</h6>
              <h2 className="display-6 fw-bold m-0">{stats.unpaidFines}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}