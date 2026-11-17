import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Fines() {
  const [fines, setFines] = useState([]);
  const [phoneInputs, setPhoneInputs] = useState({});
  const [sendingId, setSendingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFines = () => {
    setLoading(true);
    api
      .get('/fines')
      .then((data) => {
        setFines(data);
        setPhoneInputs((prev) => {
          const updated = { ...prev };
          data.forEach((f) => {
            if (!updated[f.id]) {
              updated[f.id] = f.memberPhone || '';
            }
          });
          return updated;
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFines();
  }, []);

  const handlePhoneChange = (fineId, val) => {
    setPhoneInputs({ ...phoneInputs, [fineId]: val });
  };

  const handlePromptMpesa = async (fine) => {
    const phone = phoneInputs[fine.id];
    if (!phone) return alert('Please enter a valid phone number');

    setSendingId(fine.id);
    try {
      const res = await api.post('/mpesa/stkpush', { fineId: fine.id, phone });
      alert(res.message);
    } catch (err) {
      alert(err.message);
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 text-shelf fw-bold m-0">Overdue Fines Management</h1>
        <button className="btn btn-sm btn-outline-secondary" onClick={loadFines}>
          ↻ Refresh Status
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Loading fines...</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-3">
          <table className="table table-hover align-middle mb-0">
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
              {fines.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-muted text-center py-3">
                    No overdue fines recorded.
                  </td>
                </tr>
              ) : (
                fines.map((f) => (
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
                        <div className="d-flex gap-2" style={{ maxWidth: '320px' }}>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="07XXXXXXXX"
                            value={phoneInputs[f.id] || ''}
                            onChange={(e) => handlePhoneChange(f.id, e.target.value)}
                          />
                          <button
                            className="btn btn-sm btn-success text-nowrap"
                            disabled={sendingId === f.id}
                            onClick={() => handlePromptMpesa(f)}
                          >
                            {sendingId === f.id ? 'Sending…' : 'Prompt M-Pesa'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-success small fw-semibold">Settled</span>
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