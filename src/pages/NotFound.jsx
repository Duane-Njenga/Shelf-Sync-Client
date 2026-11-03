import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center mt-5">
      <h1 className="h3">Page not found</h1>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Link to="/">Go to the home page</Link>
    </div>
  );
}
