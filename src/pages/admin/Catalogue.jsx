import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Catalogue() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (categoryId) query.append('category_id', categoryId);

    api
      .get(`/books?${query.toString()}`)
      .then(setBooks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, categoryId]);

  return (
    <div>
      <h1 className="h4 text-shelf fw-bold mb-4">Book Catalogue</h1>

      {/* Filter and Search Controls */}
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

      {loading ? (
        <p className="text-muted">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-muted">No books found.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {books.map((book) => (
            <div className="col" key={book.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <span className="badge bg-secondary mb-2">{book.category || 'General'}</span>
                  <h5 className="card-title h6 fw-bold">{book.title}</h5>
                  <p className="card-text text-muted small mb-2">By {book.authors || 'Unknown'}</p>
                  <p className="card-text small">{book.description}</p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between align-items-center">
                  <small className="text-muted">Location: {book.shelfLocation || 'N/A'}</small>
                  <span className={`badge ${book.availableCopies > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'On Loan'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}