import { useAuth } from '../auth/AuthContext.jsx';

export default function Account() {
  const { user } = useAuth();

  return (
    <>
      <h1 className="h4 text-shelf fw-bold mb-3">My Account</h1>
      <div className="card" style={{ maxWidth: 480 }}>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between">
            <span className="text-muted">Membership No.</span>
            <strong>{user?.membershipNo}</strong>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span className="text-muted">Name</span>
            <span>{user?.fullName}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span className="text-muted">Email</span>
            <span>{user?.email}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span className="text-muted">Phone</span>
            <span>{user?.phone}</span>
          </li>
        </ul>
      </div>
    </>
  );
}
