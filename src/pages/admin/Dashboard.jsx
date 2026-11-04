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
        <div className="col-md-3">
          <div className="card text-white bg-primary shadow-sm p-3">
            <div className="card-body">
              <h6 className="card-title text-uppercase small">Total Catalog Books</h6>
              <h2 className="display-6 fw-bold m-0">{stats.totalBooks}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success shadow-sm p-3">
            <div className="card-body">
              <h6 className="card-title text-uppercase small">Active Book Loans</h6>
              <h2 className="display-6 fw-bold m-0">{stats.activeLoans}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info shadow-sm p-3">
            <div className="card-body">
              <h6 className="card-title text-uppercase small">Registered Members</h6>
              <h2 className="display-6 fw-bold m-0">{stats.totalMembers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger shadow-sm p-3">
            <div className="card-body">
              <h6 className="card-title text-uppercase small">Unpaid Fines (KES)</h6>
              <h2 className="display-6 fw-bold m-0">{stats.unpaidFines}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}