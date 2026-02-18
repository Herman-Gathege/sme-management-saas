//frontend/src/features/sales/AllSales.jsx

import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { listOwnerSales } from "../../api/sales";

export default function AllSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSale, setExpandedSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
  const fetchSales = async () => {
    try {
      const data = await listOwnerSales();
      setSales(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchSales();
}, []);


  const toggleSale = (saleId) => {
    setExpandedSale(expandedSale === saleId ? null : saleId);
  };

  // -----------------------
  // Filter sales
  // -----------------------
  const filteredSales = sales.filter((sale) => {
    const staffMatch = sale.staff
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const itemsMatch = sale.items.some((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    let dateMatch = true;
    const saleDate = new Date(sale.created_at);

    if (dateRange.from) {
      dateMatch = dateMatch && saleDate >= new Date(dateRange.from);
    }
    if (dateRange.to) {
      const end = new Date(dateRange.to);
      end.setHours(23, 59, 59, 999);
      dateMatch = dateMatch && saleDate <= end;
    }

    return (staffMatch || itemsMatch) && dateMatch;
  });

  

  // -----------------------
  // Pagination logic
  // -----------------------
  const indexOfLastSale = currentPage * itemsPerPage;
  const indexOfFirstSale = indexOfLastSale - itemsPerPage;
  const paginatedSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  if (loading) return <p>Loading sales...</p>;
  if (error) return <p className="text-error">{error}</p>;

  return (
    <section className="card flex flex-col gap-md">
      {/* Header + filters */}
      <div className="flex flex-col gap-sm">
        <h3 className="text-lg text-bold">Sales History</h3>

        <div className="flex flex-mobile-col gap-sm">
          <input
            className="input"
            type="text"
            placeholder="Search by staff or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            className="input"
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
          />

          <input
            className="input"
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchTerm("");
              setDateRange({ from: "", to: "" });
            }}
          >
            Clear Filters
          </button>

        </div>
      </div>

      {paginatedSales.length === 0 ? (
        <p className="text-muted">No sales found.</p>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="table-wrapper hidden-mobile">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Method</th>
                  <th>Staff</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {paginatedSales.map((sale, index) => {
                  const rows = [
                    // ===== Main row =====
                    <tr key={sale.sale_id}>
                      <td>{indexOfFirstSale + index + 1}</td>
                      <td>{sale.payment_method || "—"}</td>
                      <td>{sale.staff || "—"}</td>
                      <td>KES {sale.total_amount.toFixed(2)}</td>
                      <td>{new Date(sale.created_at).toLocaleString()}</td>

                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => toggleSale(sale.sale_id)}
                        >
                          {expandedSale === sale.sale_id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>,
                  ];

                  if (expandedSale === sale.sale_id) {
                    rows.push(
                      <tr key={`expanded-${sale.sale_id}`}>
                        <td colSpan={6}>
                          <div className="expanded-card">
                            {Array.isArray(sale.items) &&
                            sale.items.length > 0 ? (
                              <ul className="expanded-list">
                                {sale.items.map((item, idx) => (
                                  <li key={idx} className="expanded-list-item">
                                    <span className="item-name">
                                      {item.name}
                                    </span>
                                    <span className="item-qty">
                                      × {item.quantity}
                                    </span>
                                    <span className="item-price">
                                      KES {item.unit_price.toFixed(2)}
                                    </span>
                                    <strong className="item-total">
                                      KES {item.line_total.toFixed(2)}
                                    </strong>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-muted">No items</span>
                            )}
                          </div>
                        </td>
                      </tr>,
                    );
                  }

                  return rows;
                })}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          {/* <div className="hidden-desktop flex flex-col gap-sm">
            {paginatedSales.map((sale, index) => (
              <div key={sale.sale_id} className="card flex flex-col gap-xs">
                <div className="flex justify-between">
                  <span className="text-bold">#{indexOfFirstSale + index + 1}</span>
                  <span className="company-blue">
                    KES {sale.total_amount.toFixed(2)}
                  </span>
                </div>

                <div className="text-sm compan">Staff: {sale.staff}</div>

                <div className="text-sm compan">
                  Method: {sale.payment_method}
                </div>

                <div className="text-xs text-muted">
                  {new Date(sale.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div> */}

          {/* ================= MOBILE CARDS ================= */}
            <div className="hidden-desktop flex flex-col gap-sm">
              {paginatedSales.map((sale, index) => (
                <div key={sale.sale_id} className="card flex flex-col gap-sm">

                  {/* Header Row */}
                  <div className="flex justify-between items-center">
                    <span className="text-bold">
                      #{indexOfFirstSale + index + 1}
                    </span>

                    <div className="flex items-center gap-sm">
                      <span className="company-blue text-bold">
                        KES {sale.total_amount.toFixed(2)}
                      </span>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => toggleSale(sale.sale_id)}
                      >
                        {expandedSale === sale.sale_id ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sale Info */}
                  <div className="text-sm">Staff: {sale.staff || "—"}</div>
                  <div className="text-sm">
                    Method: {sale.payment_method || "—"}
                  </div>
                  <div className="text-xs text-muted">
                    {new Date(sale.created_at).toLocaleString()}
                  </div>

                  {/* Expanded Items */}
                  {expandedSale === sale.sale_id && (
                    <div className="expanded-card mt-sm">
                      {Array.isArray(sale.items) && sale.items.length > 0 ? (
                        <ul className="expanded-list">
                          {sale.items.map((item, idx) => (
                            <li key={idx} className="expanded-list-item">
                              <span className="item-name">
                                {item.name}
                              </span>
                              <span className="item-qty">
                                × {item.quantity}
                              </span>
                              <span className="item-price">
                                KES {item.unit_price.toFixed(2)}
                              </span>
                              <strong className="item-total">
                                KES {item.line_total.toFixed(2)}
                              </strong>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-muted">No items</span>
                      )}
                    </div>
                  )}

                </div>
              ))}
            </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex gap-sm justify-center mt-md">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Prev
              </button>

              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="btn btn-secondary"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
