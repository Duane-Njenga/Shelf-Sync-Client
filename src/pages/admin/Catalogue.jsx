import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Catalogue() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);

  const loadBooks = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (categoryId) query.append('category_id', categoryId);

    api
      .get(`/books?${query.toString()}`)
      .then(setBooks)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    loadBooks();
  }, [search, categoryId]);

  const handleRent = async (bookId) => {
    try {
      const res = await api.post('/loans/request', { bookId });
      alert(res.message || 'Borrow request sent!');
      loadBooks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReserve = async (bookId) => {
    try {
      const res = await api.post('/reservations/request', { bookId });
      alert(res.message || 'Reservation request sent!');
      loadBooks();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">Book Catalogue</h1>

      {/* Search and Category Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, author, or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <p className="text-muted">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-muted">No books found.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {books.map((book) => (
            <div className="col" key={book.id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <span className="badge bg-secondary mb-2 align-self-start">{book.category || 'General'}</span>
                  <h5 className="card-title h6 fw-bold">{book.title}</h5>
                  <p className="card-text text-muted small mb-2">By {book.authors || 'Unknown'}</p>
                  <p className="card-text small text-secondary flex-grow-1">{book.description}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                    <small className="text-muted">Shelf: {book.shelfLocation || 'N/A'}</small>
                    <span className={`badge ${book.availableCopies > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'On Loan'}
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 d-flex gap-2 pb-3">
                  <button
                    className="btn btn-primary btn-sm flex-fill"
                    disabled={book.availableCopies === 0}
                    onClick={() => handleRent(book.id)}
                  >
                    Rent / Borrow
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm flex-fill"
                    onClick={() => handleReserve(book.id)}
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}