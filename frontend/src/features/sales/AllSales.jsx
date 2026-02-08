//frontend/src/features/sales/AllSales.jsx

import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
// import styles from "../dashboard/layout/DashboardLayout.module.css";

export default function AllSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSale, setExpandedSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(`${API_BASE}/api/sales/owner`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contentType = res.headers.get("content-type");
        let data;

        if (contentType && contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          console.error("Unexpected response:", text);
          throw new Error("Server returned non-JSON response");
        }

        if (!res.ok) throw new Error(data.error || "Failed to load sales");

        setSales(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [API_BASE]);

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
  if (error) return <p className={styles.message}>{error}</p>;

  // return (
  //   <section className={styles["stock-history-card"]}>
  //     <div
  //       style={{
  //         marginBottom: "1rem",
  //         display: "flex",
  //         gap: "1rem",
  //         flexWrap: "wrap",
  //         alignItems: "center",
  //       }}
  //     >
  //       <h3 style={{ flexBasis: "100%" }}>Sales History</h3>

  //       {/* Search Bar */}
  //       <label style={{ fontWeight: "medium" }}>
  //         Search:
  //         <input
  //           type="text"
  //           placeholder="Search by staff or item..."
  //           value={searchTerm}
  //           onChange={(e) => setSearchTerm(e.target.value)}
  //           style={{ padding: "0.4rem", flex: "1 1 200px" }}
  //         />
  //       </label>

  //       {/* Compact Date Range */}
  //       <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
  //         <label>
  //           From:
  //           <input
  //             type="date"
  //             value={dateRange.from}
  //             onChange={(e) =>
  //               setDateRange({ ...dateRange, from: e.target.value })
  //             }
  //             style={{ padding: "0.3rem", marginLeft: "0.2rem" }}
  //           />
  //         </label>
  //         <label>
  //           To:
  //           <input
  //             type="date"
  //             value={dateRange.to}
  //             onChange={(e) =>
  //               setDateRange({ ...dateRange, to: e.target.value })
  //             }
  //             style={{ padding: "0.3rem", marginLeft: "0.2rem" }}
  //           />
  //         </label>
  //       </div>
  //     </div>

  //     {paginatedSales.length === 0 ? (
  //       <p>No sales found.</p>
  //     ) : (
  //       <>
  //         <table className={styles["stock-history-table"]}>
  //           <thead>
  //             <tr>
  //               <th>Sale ID</th>
  //               <th>Payment Method</th>
  //               <th>Staff</th>
  //               <th>Total Amount</th>
  //               <th>Date</th>
  //               <th>Action</th>
  //             </tr>
  //           </thead>

  //           <tbody>
  //             {paginatedSales.map((sale) => {
  //               const rows = [
  //                 // Main Sale Row
  //                 <tr key={sale.sale_id}>
  //                   <td>{sale.sale_id}</td>
  //                   <td>{sale.payment_method || "—"}</td>
  //                   <td>{sale.staff || "—"}</td>
  //                   <td>KES {sale.total_amount.toFixed(2)}</td>
  //                   <td>
  //                     {new Date(sale.created_at).toLocaleString("en-KE", {
  //                       year: "numeric",
  //                       month: "short",
  //                       day: "numeric",
  //                       hour: "2-digit",
  //                       minute: "2-digit",
  //                       second: "2-digit",
  //                     })}
  //                   </td>
  //                   <td>
  //                     <button
  //                       className={styles.iconBtn}
  //                       onClick={() => toggleSale(sale.sale_id)}
  //                     >
  //                       {expandedSale === sale.sale_id ? (
  //                         <FiChevronUp size={20} title="Hide Sale" />
  //                       ) : (
  //                         <FiChevronDown size={20} title="View Sale" />
  //                       )}
  //                     </button>
  //                   </td>
  //                 </tr>,
  //               ];

  //               // Expanded Sale Row (if expanded)
  //               if (expandedSale === sale.sale_id) {
  //                 rows.push(
  //                   <tr key={`expanded-${sale.sale_id}`}>
  //                     <td colSpan={5}>
  //                       <div className={styles.expandedSale}>
  //                         {Array.isArray(sale.items) &&
  //                         sale.items.length > 0 ? (
  //                           <ul style={{ margin: 0, paddingLeft: "1rem" }}>
  //                             {sale.items.map((item, idx) => (
  //                               <li key={idx}>
  //                                 {item.name} — {item.quantity} × KES{" "}
  //                                 {item.unit_price.toFixed(2)} = KES{" "}
  //                                 {item.line_total.toFixed(2)}
  //                               </li>
  //                             ))}
  //                           </ul>
  //                         ) : (
  //                           <em>No items</em>
  //                         )}
  //                       </div>
  //                     </td>
  //                   </tr>,
  //                 );
  //               }

  //               return rows;
  //             })}
  //           </tbody>
  //         </table>

  //         {/* Pagination Controls */}
  //         {totalPages > 1 && (
  //           <div className={styles.pagination}>
  //             <button
  //               onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
  //               disabled={currentPage === 1}
  //             >
  //               Prev
  //             </button>
  //             <span>
  //               Page {currentPage} of {totalPages}
  //             </span>
  //             <button
  //               onClick={() =>
  //                 setCurrentPage((p) => Math.min(p + 1, totalPages))
  //               }
  //               disabled={currentPage === totalPages}
  //             >
  //               Next
  //             </button>
  //           </div>
  //         )}
  //       </>
  //     )}
  //   </section>
  // );

  return (
  <section className="card flex flex-col gap-md">

    {/* Header + filters */}
    <div className="flex flex-col gap-sm">

      <h3 className="text-lg text-bold">Sales History</h3>

      <div className="flex gap-sm wrap">
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
          onChange={(e) =>
            setDateRange({ ...dateRange, to: e.target.value })
          }
        />
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
                <th>ID</th>
                <th>Method</th>
                <th>Staff</th>
                <th>Total</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>

            <tbody>
  {paginatedSales.map((sale) => {
    const rows = [
      // ===== Main row =====
      <tr key={sale.sale_id}>
        <td>{sale.sale_id}</td>
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

    // ===== Expanded dropdown row =====
    if (expandedSale === sale.sale_id) {
      rows.push(
        <tr key={`expanded-${sale.sale_id}`}>
          <td colSpan={6}>
            <div className="card bg-light flex flex-col gap-xs">

              {Array.isArray(sale.items) && sale.items.length > 0 ? (
                <ul className="text-sm">
                  {sale.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} — {item.quantity} × KES{" "}
                      {item.unit_price.toFixed(2)} ={" "}
                      <strong>KES {item.line_total.toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted">No items</span>
              )}

            </div>
          </td>
        </tr>
      );
    }

    return rows;
  })}
</tbody>

          </table>
        </div>


        {/* ================= MOBILE CARDS ================= */}
        <div className="hidden-desktop flex flex-col gap-sm">
          {paginatedSales.map((sale) => (
            <div key={sale.sale_id} className="card flex flex-col gap-xs">
              <div className="flex justify-between">
                <span className="text-bold">#{sale.sale_id}</span>
                <span>KES {sale.total_amount.toFixed(2)}</span>
              </div>

              <div className="text-sm">
                Staff: {sale.staff}
              </div>

              <div className="text-sm">
                Method: {sale.payment_method}
              </div>

              <div className="text-xs text-muted">
                {new Date(sale.created_at).toLocaleString()}
              </div>
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
