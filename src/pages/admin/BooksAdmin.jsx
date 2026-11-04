import { useEffect, useState } from 'react';
import { api } from '../../api.js';
import FormField from '../../components/FormField.jsx';

export default function BooksAdmin() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  
  const [selectedBookId, setSelectedBookId] = useState('');
  const [copyCountInput, setCopyCountInput] = useState(1);

  const [form, setForm] = useState({
    title: '',
    isbn: '',
    authorName: '',
    categoryId: '',
    shelfLocation: '',
    publisher: '',
    yearPublished: '',
    copyCount: 1,
    description: '',
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get('/books'), api.get('/categories')])
      .then(([b, c]) => {
        setBooks(b);
        setCategories(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/books', form);
      setShowAddModal(false);
      setForm({
        title: '',
        isbn: '',
        authorName: '',
        categoryId: '',
        shelfLocation: '',
        publisher: '',
        yearPublished: '',
        copyCount: 1,
        description: '',
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateCopies = async (e) => {
    e.preventDefault();
    if (!selectedBookId) return alert('Please select a book');
    try {
      await api.patch(`/books/${selectedBookId}/copies`, { copyCount: Number(copyCountInput) });
      setShowCopyModal(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 text-shelf fw-bold m-0">Manage Books</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={() => setShowCopyModal(true)}>
            ⚙️ Adjust Copies
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add New Book
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading catalog...</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-3">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ISBN</th>
                <th>Title</th>
                <th>Authors</th>
                <th>Category</th>
                <th>Shelf</th>
                <th>Copies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td><code>{b.isbn}</code></td>
                  <td className="fw-semibold">{b.title}</td>
                  <td>{b.authors || 'N/A'}</td>
                  <td><span className="badge bg-secondary">{b.category || 'General'}</span></td>
                  <td>{b.shelfLocation || 'N/A'}</td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {b.availableCopies} / {b.totalCopies} Available
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjust Copy Count Modal */}
      {showCopyModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Adjust Book Physical Copies</h5>
                <button type="button" className="btn-close" onClick={() => setShowCopyModal(false)}></button>
              </div>
              <form onSubmit={handleUpdateCopies}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fw-semibold">Select Book</label>
                    <select
                      className="form-select"
                      value={selectedBookId}
                      onChange={(e) => {
                        setSelectedBookId(e.target.value);
                        const b = books.find((x) => String(x.id) === e.target.value);
                        if (b) setCopyCountInput(b.totalCopies);
                      }}
                      required
                    >
                      <option value="">-- Choose Book --</option>
                      {books.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title} (Current Total: {b.totalCopies})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label fw-semibold">Total Physical Copies</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={copyCountInput}
                      onChange={(e) => setCopyCountInput(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCopyModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Save Copies</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Book</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAdd}>
                <div className="modal-body row g-3">
                  <div className="col-md-8">
                    <FormField label="Title" name="title" value={form.title} onChange={update} required />
                  </div>
                  <div className="col-md-4">
                    <FormField label="ISBN" name="isbn" value={form.isbn} onChange={update} required />
                  </div>
                  <div className="col-md-6">
                    <FormField label="Author Name" name="authorName" value={form.authorName} onChange={update} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Category</label>
                    <select className="form-select" name="categoryId" value={form.categoryId} onChange={update}>
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <FormField label="Publisher" name="publisher" value={form.publisher} onChange={update} />
                  </div>
                  <div className="col-md-4">
                    <FormField label="Year Published" name="yearPublished" type="number" value={form.yearPublished} onChange={update} />
                  </div>
                  <div className="col-md-4">
                    <FormField label="Shelf Location" name="shelfLocation" value={form.shelfLocation} onChange={update} placeholder="e.g. CS-01" />
                  </div>
                  <div className="col-md-4">
                    <FormField label="Initial Physical Copies" name="copyCount" type="number" min="1" value={form.copyCount} onChange={update} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea className="form-control" name="description" rows="2" value={form.description} onChange={update}></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Book</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}