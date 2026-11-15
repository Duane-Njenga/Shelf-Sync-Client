export default function Help() {
  return (
    <div className="max-w-4xl mx-auto py-4">
      <h1 className="h4 text-shelf fw-bold mb-4">ShelfSync Help & Information Guide</h1>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold text-primary mb-3">Borrowing Rules & Limits</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><strong>Max Active Loans:</strong> Members can borrow up to 3 books at a time.</li>
                <li className="list-group-item"><strong>Standard Duration:</strong> Books are issued for a maximum period of 14 days.</li>
                <li className="list-group-item"><strong>Renewals:</strong> Books can be renewed once if no active reservations exist.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold text-danger mb-3">Fines & Late Fee Policy</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><strong>Daily Overdue Rate:</strong> KES 10 per book per day past the due date.</li>
                <li className="list-group-item"><strong>M-Pesa Payments:</strong> Fines are paid directly via M-Pesa prompts sent by the librarian.</li>
                <li className="list-group-item"><strong>Account Suspensions:</strong> Accounts with fines exceeding KES 500 will be restricted from borrowing.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Reservations & Desk Collection</h5>
              <p className="card-text text-secondary">
                When you reserve a book that is currently on loan, you will receive a notification once the book is returned. Reserved items are held at the library circulation desk for a maximum of 48 hours before being released back to the general catalogue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}