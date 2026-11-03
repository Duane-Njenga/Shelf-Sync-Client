import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { isStaff, useAuth } from '../auth/AuthContext.jsx';
import FormField from '../components/FormField.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState(null);
  const [fields, setFields] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={location.state?.from?.pathname ?? (isStaff(user) ? '/admin' : '/')} replace />;
  }

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setFields({});
    try {
      await login(form.identifier, form.password);
    } catch (err) {
      setError(err.message);
      setFields(err.fields ?? {});
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Sign in">
      <form onSubmit={submit} noValidate>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <FormField
          label="Membership No. / Email"
          name="identifier"
          value={form.identifier}
          onChange={update}
          error={fields.identifier}
          autoComplete="username"
          autoFocus
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={update}
          error={fields.password}
          autoComplete="current-password"
        />
        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Login'}
        </button>
      </form>
      <p className="text-center mt-3 mb-0">
        New to ShelfSync? <Link to="/register">Register</Link>
      </p>
    </AuthLayout>
  );
}
