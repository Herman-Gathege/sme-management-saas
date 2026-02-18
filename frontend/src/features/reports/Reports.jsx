//frontend/src/features/reports/Reports.jsx
import { useEffect, useState } from "react";
import { getSalesReport } from "../../api/report";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("all"); // default filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // adjust as needed


  // const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchReports(selectedFilter);
  }, [selectedFilter]);

  const fetchReports = async (filter) => {
  setLoading(true);
  setError("");

  try {
    const data = await getSalesReport(filter);

    setSummary(data.summary);
    setSales(data.sales);
    setCurrentPage(1); // nice UX reset page
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

  // const indexOfLastSale = currentPage * itemsPerPage;
  // const indexOfFirstSale = indexOfLastSale - itemsPerPage;
  
  // Convert dates to timestamps for comparison
  const filteredSales = sales.filter((s) => {
    const saleTime = new Date(s.created_at).getTime();

    const startTime = startDate ? new Date(startDate).getTime() : null;
    const endTime = endDate
      ? new Date(endDate + "T23:59:59").getTime()
      : null; // include full end day

    if (startTime && saleTime < startTime) return false;
    if (endTime && saleTime > endTime) return false;

    return true;
  });

  const indexOfLastSale = currentPage * itemsPerPage;
  const indexOfFirstSale = indexOfLastSale - itemsPerPage;
  const paginatedSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);



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
        <p>View Sales:</p>
        <div className="flex flex-wrap gap-sm items-center">
          <div className="flex gap-xs items-center flex-wrap">
            <label className="text-sm text-muted" htmlFor="startDate">From</label>
            <input
              id="startDate"
              type="date"
              className="input"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
                setSelectedFilter("");
              }}
            />
          </div>

          <div className="flex gap-xs items-center flex-wrap">
            <label className="text-sm text-muted" htmlFor="endDate">To</label>
            <input
              id="endDate"
              type="date"
              className="input"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
                setSelectedFilter("");
              }}
            />
          </div>

          <div className="flex gap-xs flex-wrap">
            {["today", "month", "all"].map((filter) => (
              <button
                key={filter}
                className={`btn mr-md ${
                  selectedFilter === filter ? "btn-filter-active" : "btn-secondary"
                }`}
                onClick={() => {
                  setSelectedFilter(filter);
                  setStartDate("");
                  setEndDate("");
                  setCurrentPage(1);
                }}
              >
                {filter === "today"
                  ? "Today"
                  : filter === "month"
                  ? "This Month"
                  : "All Time"}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap">
            <button
              className="btn btn-warning"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setSelectedFilter("all");
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </button>
          </div>
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
