import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="text-center mt-5">
      <h1 className="h3">Access denied</h1>
      <p className="text-muted">You do not have permission to view this page.</p>
      <Link to="/">Back to the catalogue</Link>
    </div>
  );
}
