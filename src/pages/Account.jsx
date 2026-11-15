import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Account() {
  const { user } = useAuth();
  const [data, setData] = useState({ loans: [], reservations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/my-account')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Helper to calculate overdue days and KES 10/day fine dynamically
  const getOverdueInfo = (loan) => {
    if (!loan.dueDate) return { isOverdue: false, days: 0, fine: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(loan.dueDate);
    due.setHours(0, 0, 0, 0);

    const diffMs = today - due;
    const daysOverdue = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (daysOverdue > 0 || loan.status === 'Overdue') {
      const effectiveDays = Math.max(daysOverdue, 1);
      const calculatedFine = loan.fineAmount ? Number(loan.fineAmount) : effectiveDays * 10;
      return { isOverdue: true, days: effectiveDays, fine: calculatedFine };
    }

    return { isOverdue: false, days: 0, fine: 0 };
  };

  // 1. Awaiting Return (includes Active and Overdue books)
  const awaitingReturn = data.loans.filter((l) => l.status === 'Active' || l.status === 'Overdue');

  // 2. Pending Issue & Reservation Requests (includes Pending loans + Pending/Ready reservations)
  const pendingRequests = [
    ...data.loans
      .filter((l) => l.status === 'Pending')
      .map((l) => ({
        uid: `loan-${l.id}`,
        title: l.title,
        isbn: l.isbn,
        type: 'Borrow / Issue',
        date: null,
        status: l.status,
      })),
    ...data.reservations
      .filter((r) => r.status === 'Pending' || r.status === 'Ready')
      .map((r) => ({
        uid: `res-${r.id}`,
        title: r.title,
        isbn: r.isbn,
        type: 'Reservation',
        date: r.reservedAt,
        status: r.status,
      })),
  ];

  // 3. Returned Books History
  const returnedBooks = data.loans.filter((l) => l.status === 'Returned');

  return (
    <div>
      {/* Member Profile Header */}
      <div className="bg-white rounded shadow-sm p-4 mb-4 d-flex flex-wrap justify-content-between align-items-center">
        <div>
          <h1 className="h4 text-shelf fw-bold mb-1">{user?.fullName}</h1>
          <p className="text-muted small mb-0">
            Membership No: <code>{user?.membershipNo}</code> • {user?.email} • {user?.phone}
          </p>
        </div>
        <span className="badge bg-primary fs-6">{user?.role}</span>
      </div>

      {loading ? (
        <p className="text-muted">Loading your account records...</p>
      ) : (
        <div className="d-flex flex-column gap-5">
          {/* TABLE 1: Awaiting Return (Active & Overdue) */}
          <section>
            <h2 className="h5 fw-bold text-dark mb-3">1. Books Awaiting Return</h2>
            <div className="table-responsive bg-white rounded shadow-sm p-3">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Book Title</th>
                    <th>Copy Barcode</th>
                    <th>Issued Date</th>
                    <th>Return Due Date</th>
                    <th>Status</th>
                    <th>Overdue Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {awaitingReturn.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-muted text-center py-3">
                        You currently have no books checked out.
                      </td>
                    </tr>
                  ) : (
                    awaitingReturn.map((loan) => {
                      const overdue = getOverdueInfo(loan);
                      return (
                        <tr key={loan.id} className={overdue.isOverdue ? 'table-danger' : ''}>
                          <td className="fw-semibold">{loan.title}</td>
                          <td><code>{loan.barcode || 'N/A'}</code></td>
                          <td>{loan.issueDate ? new Date(loan.issueDate).toLocaleDateString() : 'N/A'}</td>
                          <td className={overdue.isOverdue ? 'fw-bold text-danger' : ''}>
                            {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td>
                            {overdue.isOverdue ? (
                              <span className="badge bg-danger">Overdue ({overdue.days}d)</span>
                            ) : (
                              <span className="badge bg-primary">Active</span>
                            )}
                          </td>
                          <td>
                            {overdue.isOverdue ? (
                              <span className="fw-bold text-danger">
                                KES {overdue.fine} {loan.fineStatus === 'Paid' ? '(Paid)' : '(Unpaid)'}
                              </span>
                            ) : (
                              <span className="text-muted small">None</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* TABLE 2: Pending Reservations & Issue Approvals */}
          <section>
            <h2 className="h5 fw-bold text-dark mb-3">2. Pending Reservations & Issue Approvals</h2>
            <div className="table-responsive bg-white rounded shadow-sm p-3">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Book Title</th>
                    <th>ISBN</th>
                    <th>Request Type</th>
                    <th>Requested On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-muted text-center py-3">
                        No pending borrow or reservation requests.
                      </td>
                    </tr>
                  ) : (
                    pendingRequests.map((req) => (
                      <tr key={req.uid}>
                        <td className="fw-semibold">{req.title}</td>
                        <td><code>{req.isbn}</code></td>
                        <td>{req.type}</td>
                        <td>{req.date ? new Date(req.date).toLocaleDateString() : 'Awaiting Desk'}</td>
                        <td>
                          {req.status === 'Ready' ? (
                            <span className="badge bg-info text-dark">Ready for Desk Pickup (48h)</span>
                          ) : (
                            <span className="badge bg-warning text-dark">Awaiting Admin Approval</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* TABLE 3: Returned Books History */}
          <section>
            <h2 className="h5 fw-bold text-dark mb-3">3. Returned Books History</h2>
            <div className="table-responsive bg-white rounded shadow-sm p-3">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Book Title</th>
                    <th>Copy Barcode</th>
                    <th>Issued Date</th>
                    <th>Returned Date</th>
                    <th>Status</th>
                    <th>Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {returnedBooks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-muted text-center py-3">
                        No returned books in your history yet.
                      </td>
                    </tr>
                  ) : (
                    returnedBooks.map((loan) => (
                      <tr key={loan.id}>
                        <td className="fw-semibold">{loan.title}</td>
                        <td><code>{loan.barcode || 'N/A'}</code></td>
                        <td>{loan.issueDate ? new Date(loan.issueDate).toLocaleDateString() : 'N/A'}</td>
                        <td>{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : 'N/A'}</td>
                        <td><span className="badge bg-success">Returned</span></td>
                        <td>
                          {loan.fineAmount && Number(loan.fineAmount) > 0 ? (
                            <span className={`badge ${loan.fineStatus === 'Paid' ? 'bg-success' : 'bg-danger'}`}>
                              KES {loan.fineAmount} ({loan.fineStatus})
                            </span>
                          ) : (
                            <span className="text-muted small">None</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}