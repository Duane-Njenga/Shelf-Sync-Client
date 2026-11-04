import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Fines() {
  const [fines, setFines] = useState([]);

  useEffect(() => {
    api.get('/fines').then(setFines).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">Overdue Fines</h1>
      <div className="table-responsive bg-white rounded shadow-sm p-3">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Member Name</th>
              <th>Days Overdue</th>
              <th>Amount (KES)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((f) => (
              <tr key={f.id}>
                <td className="fw-semibold">{f.memberName}</td>
                <td>{f.daysOverdue} days</td>
                <td className="fw-bold text-danger">KES {f.amount}</td>
                <td>
                  <span className={`badge ${f.status === 'Paid' ? 'bg-success' : 'bg-danger'}`}>
                    {f.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}