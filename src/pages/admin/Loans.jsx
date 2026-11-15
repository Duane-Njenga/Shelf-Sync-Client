import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get('/loans'), api.get('/reservations')])
      .then(([l, r]) => {
        setLoans(l);
        setReservations(r);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReturn = async (loanId) => {
    try {
      await api.patch(`/loans/${loanId}/return`);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLoanApproval = async (loanId, status) => {
    try {
      await api.patch(`/loans/${loanId}/status`, { status });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReservationApproval = async (resId, status) => {
    try {
      await api.patch(`/reservations/${resId}/status`, { status });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter out returned loans for active list + apply search filter
  const activeLoans = loans
    .filter((l) => l.status === 'Active')
    .filter((l) => {
      const q = search.toLowerCase();
      return (
        (l.title && l.title.toLowerCase().includes(q)) ||
        (l.memberName && l.memberName.toLowerCase().includes(q)) ||
        (l.membershipNo && l.membershipNo.toLowerCase().includes(q))
      );
    });

  const pendingLoans = loans.filter((l) => l.status === 'Pending');
  const pendingReservations = reservations.filter((r) => r.status === 'Pending');

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">Issue & Return Books</h1>

      {/* Search Bar for Active Loans */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search active loans by book title or member name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Active Loans Table */}
      <div className="mb-5">
        <h2 className="h5 fw-bold text-dark mb-3">Active Issued Books</h2>
        {loading ? (
          <p className="text-muted">Loading loans...</p>
        ) : (
          <div className="table-responsive bg-white rounded shadow-sm p-3">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Barcode</th>
                  <th>Book Title</th>
                  <th>Member Name</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeLoans.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-muted text-center py-3">
                      No active issued books found.
                    </td>
                  </tr>
                ) : (
                  activeLoans.map((l) => (
                    <tr key={l.id}>
                      <td><code>{l.barcode || 'N/A'}</code></td>
                      <td className="fw-semibold">{l.title || 'Untitled'}</td>
                      <td>{l.memberName} ({l.membershipNo})</td>
                      <td>{l.issueDate ? new Date(l.issueDate).toLocaleDateString() : 'N/A'}</td>
                      <td>{l.dueDate ? new Date(l.dueDate).toLocaleDateString() : 'N/A'}</td>
                      <td><span className="badge bg-primary">Active</span></td>
                      <td>
                        <button className="btn btn-sm btn-success" onClick={() => handleReturn(l.id)}>
                          Return Book
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending Requests Section */}
      <div className="bg-white rounded shadow-sm p-4 border-top border-3 border-warning">
        <h2 className="h5 fw-bold text-dark mb-3">Pending Requests (Borrowing & Reservations)</h2>

        {/* Pending Borrow Requests */}
        <h6 className="fw-bold text-muted mt-3 mb-2">Borrow Requests</h6>
        <div className="table-responsive mb-4">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Book Title</th>
                <th>Member</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingLoans.length === 0 ? (
                <tr><td colSpan="4" className="text-muted text-center">No pending borrow requests.</td></tr>
              ) : (
                pendingLoans.map((pl) => (
                  <tr key={pl.id}>
                    <td className="fw-semibold">{pl.title}</td>
                    <td>{pl.memberName}</td>
                    <td><span className="badge bg-warning text-dark">Pending</span></td>
                    <td>
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleLoanApproval(pl.id, 'Active')}>
                        Approve
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleLoanApproval(pl.id, 'Rejected')}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pending Reservations */}
        <h6 className="fw-bold text-muted mb-2">Reservation Requests</h6>
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Book Title</th>
                <th>Member</th>
                <th>Requested Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingReservations.length === 0 ? (
                <tr><td colSpan="4" className="text-muted text-center">No pending reservations.</td></tr>
              ) : (
                pendingReservations.map((pr) => (
                  <tr key={pr.id}>
                    <td className="fw-semibold">{pr.title}</td>
                    <td>{pr.memberName}</td>
                    <td>{new Date(pr.reservedAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleReservationApproval(pr.id, 'Ready')}>
                        Approve
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleReservationApproval(pr.id, 'Rejected')}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}