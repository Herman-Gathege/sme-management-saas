//frontend/src/features/reports/Reports.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";


export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all"); // default filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // adjust as needed



  useEffect(() => {
    fetchReports(selectedFilter);
  }, [selectedFilter]);

  const fetchReports = async (filter) => {
    setLoading(true);
    setError("");

    let query = "";
    if (filter === "today") query = "?range=today";
    else if (filter === "month") query = "?range=month";

    try {
      const res = await apiFetch(`/api/reports/sales${query}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load reports");

      setSummary(data.summary);
      setSales(data.sales);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const exportCSV = () => {
    if (sales.length === 0) return alert("No sales to export");

    const headers = ["Sale ID", "Date", "Payment Method", "Amount"];
    const rows = sales.map((s) => [
      s.sale_id,
      new Date(s.created_at).toLocaleString(),
      s.payment_method,
      s.total_amount.toFixed(2),
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((r) => (csv += r.join(",") + "\n"));

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_report.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const indexOfLastSale = currentPage * itemsPerPage;
  const indexOfFirstSale = indexOfLastSale - itemsPerPage;
  const paginatedSales = sales.slice(indexOfFirstSale, indexOfLastSale);
  const totalPages = Math.ceil(sales.length / itemsPerPage);


  if (loading) return <p>Loading reports…</p>;
  if (error) return <p className="text-error">{error}</p>;

  return (
    <section className="card flex flex-col gap-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg text-bold ">Sales Reports</h3>

        <button className="btn btn-primary" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid-summary">
          {["cash", "mpesa", "credit", "total"].map((key) => (
            <div key={key} className="stat-card-r card-w">
              <span className="text-sm text-muted">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
              <span className="text-lg text-bold company-blue">
                KES {(summary?.[key] ?? 0).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <p>View Sales From:</p>
      <div className="flex gap-sm wrap">
        <button
          className="btn btn-secondary"
          onClick={() => {
              console.log("Setting filter to today");
              setSelectedFilter("today");
            }}          
                    disabled={selectedFilter === "today"}
                  >
          Today
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setSelectedFilter("month")}
          disabled={selectedFilter === "month"}
        >
          This Month
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setSelectedFilter("all")}
          disabled={selectedFilter === "all"}
        >
          All Time
        </button>
      </div>

      {/* Desktop table */}
      <div className="table-wrapper hidden-mobile">
        <table className="customers-table">
          <thead>
            <tr>              
              <th>Number</th>
              <th>Date</th>
              <th>Method</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSales.length > 0 ? (
              paginatedSales.map((s, index) => (
                <tr key={s.sale_id}>
                  <td>{indexOfFirstSale + index + 1}</td> 
                  <td>{new Date(s.created_at).toLocaleString()}</td>
                  <td>{s.payment_method.toUpperCase()}</td>
                  <td>KES {s.total_amount.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-muted">
                  No sales found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="hidden-desktop flex flex-col gap-sm">
        {sales.length === 0 && <p className="text-muted">No sales found</p>}
        {paginatedSales.map((s, index) => (
          <div key={s.sale_id} className="card flex flex-col gap-xs">
            <div className="text-sm">
              <strong className="mr-sm">#{indexOfFirstSale + index + 1}</strong>
              <span className="ml-sm text-bold company-blue">
                KES {s.total_amount.toFixed(2)}
              </span>
            </div>

            <div className="text-sm">
              <strong>Date:</strong> {new Date(s.created_at).toLocaleString()}
            </div>

            <div className="text-sm">
              <strong>Payment Method:</strong> {s.payment_method.toUpperCase()}
            </div>
          </div>
        ))}        
      </div>

      {totalPages > 1 && (
  <div className="flex gap-sm justify-center mt-md">
    <button
      className="btn btn-secondary"
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
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
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}

    </section>
  );
}
