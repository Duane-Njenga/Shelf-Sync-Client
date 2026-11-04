import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Fines() {
  const [fines, setFines] = useState([]);
  const [phoneInputs, setPhoneInputs] = useState({});

  useEffect(() => {
    api.get('/fines')
      .then((data) => {
        setFines(data);
        const initialPhones = {};
        data.forEach((f) => {
          initialPhones[f.id] = f.memberPhone || '';
        });
        setPhoneInputs(initialPhones);
      })
      .catch(console.error);
  }, []);

  const handlePhoneChange = (fineId, val) => {
    setPhoneInputs({ ...phoneInputs, [fineId]: val });
  };

  const handlePromptMpesa = (fine) => {
    const phone = phoneInputs[fine.id];
    if (!phone) return alert('Please enter a valid phone number');
    alert(`[M-Pesa Simulation] STK push prompt sent to ${phone} for KES ${fine.amount}`);
  };

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">Overdue Fines Management</h1>
      <div className="table-responsive bg-white rounded shadow-sm p-3">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Member Name</th>
              <th>Days Overdue</th>
              <th>Amount (KES)</th>
              <th>Status</th>
              <th>M-Pesa Payment Prompt</th>
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
                <td>
                  {f.status === 'Unpaid' ? (
                    <div className="d-flex gap-2" style={{ maxWidth: '300px' }}>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="07XXXXXXXX"
                        value={phoneInputs[f.id] || ''}
                        onChange={(e) => handlePhoneChange(f.id, e.target.value)}
                      />
                      <button
                        className="btn btn-sm btn-outline-success text-nowrap"
                        onClick={() => handlePromptMpesa(f)}
                      >
                        Prompt M-Pesa
                      </button>
                    </div>
                  ) : (
                    <span className="text-muted small">Settled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}