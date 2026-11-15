import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = () => {
    setLoading(true);
    api
      .get('/reservations')
      .then(setReservations)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status });
      loadReservations();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFulfill = async (id) => {
    try {
      const res = await api.post(`/reservations/${id}/fulfill`);
      alert(res.message || 'Book issued to member!');
      loadReservations();
    } catch (err) {
      alert(err.message);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning text-dark';
      case 'Ready':
        return 'bg-info text-dark';
      case 'Fulfilled':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">Book Reservations</h1>
      {loading ? (
        <p className="text-muted">Loading reservations...</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-3">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Book Title</th>
                <th>Member Name</th>
                <th>Reserved At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-muted text-center py-3">
                    No reservations found.
                  </td>
                </tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-semibold">{r.title}</td>
                    <td>
                      {r.memberName} {r.membershipNo ? `(${r.membershipNo})` : ''}
                    </td>
                    <td>{new Date(r.reservedAt).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${getBadgeClass(r.status)}`}>{r.status}</span>
                    </td>
                    <td>
                      {r.status === 'Pending' && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleStatusChange(r.id, 'Ready')}
                          >
                            Approve & Hold
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleStatusChange(r.id, 'Rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {r.status === 'Ready' && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleFulfill(r.id)}
                          >
                            Fulfill & Issue
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleStatusChange(r.id, 'Cancelled')}
                          >
                            Cancel Hold
                          </button>
                        </div>
                      )}

                      {(r.status === 'Fulfilled' || r.status === 'Rejected' || r.status === 'Cancelled') && (
                        <span className="text-muted small">Completed</span>
                      )}
                    </td>
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