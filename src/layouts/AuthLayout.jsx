export default function AuthLayout({ title, children }) {
  return (
    <div className="d-flex min-vh-100">
      <div className="auth-brand d-none d-md-flex flex-column justify-content-center align-items-center text-center p-5 w-50">
        <h1 className="fw-bold">ShelfSync</h1>
        <p className="mb-5">Library Management System</p>
        <small>Search. Reserve. Borrow. Sync.</small>
      </div>
      <div className="d-flex flex-grow-1 justify-content-center align-items-center p-3 bg-white">
        <div className="w-100" style={{ maxWidth: 420 }}>
          <h2 className="h4 text-shelf fw-bold text-center mb-4">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
