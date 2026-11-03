import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import FormField from '../components/FormField.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';

const EMPTY = { fullName: '', email: '', phone: '', password: '', confirmPassword: '' };

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [fields, setFields] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setFields({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setFields({});
    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
    } catch (err) {
      setError(err.fields && Object.keys(err.fields).length ? null : err.message);
      setFields(err.fields ?? {});
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create your account">
      <form onSubmit={submit} noValidate>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <FormField label="Full name" name="fullName" value={form.fullName} onChange={update} error={fields.fullName} autoComplete="name" />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={update} error={fields.email} autoComplete="email" />
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={update}
          error={fields.phone}
          autoComplete="tel"
          placeholder="0712345678"
          help="Used for M-Pesa payments and reservation alerts."
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={update}
          error={fields.password}
          autoComplete="new-password"
          help="At least 8 characters."
        />
        <FormField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={update}
          error={fields.confirmPassword}
          autoComplete="new-password"
        />
        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Register'}
        </button>
      </form>
      <p className="text-center mt-3 mb-0">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
