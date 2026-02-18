// frontend/src/features/stock/StockHistory.jsx
import { useEffect, useState } from "react";
import { getStockHistory } from "../../api/stock";

export default function StockHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  // const API_BASE = import.meta.env.VITE_API_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // adjust as needed

 // Filter history
  const filteredHistory = history.filter((h) => {
    const term = searchTerm.toLowerCase();

    return (
      h.stock_name?.toLowerCase().includes(term) ||
      h.action?.toLowerCase().includes(term) ||
      h.user?.toLowerCase().includes(term) ||
      h.detailsText?.toLowerCase().includes(term)
    );
  });

  // Recalculate pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  useEffect(() => {
  const fetchHistory = async () => {
    try {
      const data = await getStockHistory();

      const transformed = data.map((h) => ({
        ...h,
        detailsText: h.details
          ? Object.entries(h.details)
              .map(([key, value]) =>
                value?.new !== undefined
                  ? `${key}: ${value.old} → ${value.new}`
                  : `${key}: ${value}`
              )
              .join(", ")
          : "",
      }));

      setHistory(transformed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, []);


  if (loading) return <p>Loading stock history...</p>;
  if (error) return <p className="text-error">{error}</p>;

  return (
    <section className="card">
      <h3 className="mb-sm">Stock History</h3>
      <div className="flex flex-mobile-col gap-sm">
        <input
        className="input mb-md"
        placeholder="Search by item, action, user or details..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // reset page on search
        }}
      />
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setSearchTerm("")}
      >
        Clear Search
      </button>
      </div>

      {history.length === 0 ? (
      <p>No history yet.</p>
    ) : (
      <>
        {/* ============== DESKTOP TABLE ============== */}
        <div className="customers-table-wrapper stock-table-wrapper hidden-on-mobile">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Stock Item</th>
                <th>Action</th>
                <th>User</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHistory.map((h) => (
                <tr key={h.id}>
                  <td>{new Date(h.created_at).toLocaleString()}</td>
                  <td>{h.stock_name}</td>
                  <td>{h.action}</td>
                  <td>{h.user}</td>
                  <td>{h.detailsText}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination flex gap-sm mt-md justify-center">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {/* {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))} */}

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

        </div>

        {/* ============== MOBILE CARDS ============== */}
        <div className="stock-cards hidden-on-desktop">
          {paginatedHistory.map((h) => (
            <div key={h.id} className="card stock-card">
              <div className="stock-card-header">
                <strong>{h.stock_name}</strong>
                <span className="text-muted">
                  {new Date(h.created_at).toLocaleString()}
                </span>
              </div>

              <div className="stock-card-body">
                <div>
                  <span>Action:</span> {h.action}
                </div>
                <div>
                  <span>User:</span> {h.user}
                </div>
                {h.detailsText && (
                  <div>
                    <span>Details:</span> {h.detailsText}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="pagination flex gap-sm mt-md justify-center hidden-desktop">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {/* {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))} */}

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

        </div>
      </>
    )}
  </section>
  );
}
