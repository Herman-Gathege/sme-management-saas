//frontend/src/features/customers/AllCustomers.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listCustomers } from "../../api/customers";
import { useNavigate } from "react-router-dom";

export default function AllCustomers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // adjust to your preference
  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();

    return (
      c.name?.toLowerCase().includes(term) ||
      c.business_name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.toLowerCase().includes(term) ||
      c.role?.toLowerCase().includes(term)
    );
  });

  // Pagination based on filtered results
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  // const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const data = await listCustomers();
      setCustomers(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCustomers();
}, []);


  return (
    <section className="dashboard-content">
      <div className="card">
        <div className="customers-header mb-md">
          <h3 className="text-lg text-bold">All Customers</h3>
          
        </div>
        <div className="flex flex-mobile-col gap-sm mb-md">
            <input
              className="input"
              placeholder="Search by name, email, phone, business or role..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset page when searching
              }}
            />

            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
            >
              Clear
            </button>
          </div>

        {loading && <p>Loading customers…</p>}
        {message && <p className="text-error">{message}</p>}

        {!loading && filteredCustomers.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="table-wrapper hidden-mobile">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Business</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((c, idx) => (
                    <tr key={c.id}>
                      <td>{idx + 1}</td>
                      <td>{c.name}</td>
                      <td>{c.business_name || "—"}</td>
                      <td>{c.email || "—"}</td>
                      <td>{c.phone || "—"}</td>
                      <td>{c.role}</td>
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

            {/* Mobile cards */}
            <div className="hidden-desktop flex flex-col gap-md">
              {paginatedCustomers.map((c, idx) => (
                <div key={c.id} className="card flex flex-col gap-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-bold">{c.name}</span>
                    <span className="text-sm text-muted">#{idx + 1}</span>
                  </div>

                  <div className="text-sm">
                    <strong>Business:</strong> {c.business_name || "—"}
                  </div>

                  <div className="text-sm">
                    <strong>Email:</strong> {c.email || "—"}
                  </div>

                  <div className="text-sm">
                    <strong>Phone:</strong> {c.phone || "—"}
                  </div>

                  <div className="text-sm">
                    <strong>Role:</strong> {c.role}
                  </div>
                </div>
              ))}

              <div className="pagination flex gap-sm mt-md justify-center hidden-desktop">
                <button
                  className="btn btn-secondary btn-sm mr-sm"
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

        {!loading && filteredCustomers.length === 0 && (
          <p>No matching customers found.</p>
        )}
      </div>
    </section>
  );
}
