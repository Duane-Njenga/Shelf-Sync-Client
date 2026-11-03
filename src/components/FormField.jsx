export default function FormField({ label, name, error, help, ...inputProps }) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={`form-control${error ? ' is-invalid' : ''}`}
        aria-describedby={error ? `${name}-error` : undefined}
        {...inputProps}
      />
      {error ? (
        <div id={`${name}-error`} className="invalid-feedback">
          {error}
        </div>
      ) : (
        help && <div className="form-text">{help}</div>
      )}
    </div>
  );
}
