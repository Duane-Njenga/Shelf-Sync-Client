import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    api.get('/reservations').then(setReservations).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">Book Reservations</h1>
      <div className="table-responsive bg-white rounded shadow-sm p-3">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Book Title</th>
              <th>Member Name</th>
              <th>Reserved At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td className="fw-semibold">{r.title}</td>
                <td>{r.memberName}</td>
                <td>{new Date(r.reservedAt).toLocaleString()}</td>
                <td><span className="badge bg-warning text-dark">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}