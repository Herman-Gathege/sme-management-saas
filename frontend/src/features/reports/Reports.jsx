//frontend/src/features/reports/Reports.jsx
import { useEffect, useState } from "react";
// import styles from "../dashboard/layout/DashboardLayout.module.css";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all"); // default filter

  const API_BASE = import.meta.env.VITE_API_URL;

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
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/reports/sales${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  if (loading) return <p>Loading reports…</p>;
  if (error) return <p className="text-error">{error}</p>;

  return (
  <section className="card flex flex-col gap-md">

    {/* Header */}
    <div className="flex justify-between items-center">
      <h3 className="text-lg text-bold">Sales Reports</h3>

      <button className="btn btn-secondary" onClick={exportCSV}>
        Export CSV
      </button>
    </div>


    {/* Summary cards */}
    {summary && (
      <div className="grid-summary">
        {["cash", "mpesa", "credit", "total"].map((key) => (
          <div key={key} className="stat-card">
            <span className="text-sm text-muted">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
            <span className="text-lg text-bold">
              KES {summary[key].toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    )}


    {/* Filters */}
    <div className="flex gap-sm wrap">
      <button
        className="btn btn-secondary"
        onClick={() => setSelectedFilter("today")}
      >
        Today
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => setSelectedFilter("month")}
      >
        This Month
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => setSelectedFilter("all")}
      >
        All Time
      </button>
    </div>


    {/* Desktop table */}
    <div className="table-wrapper hidden-mobile">
      <table className="customers-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Method</th>
            <th>Amount</th>
            <th>ID</th>
          </tr>
        </thead>

        <tbody>
          {sales.length > 0 ? (
            sales.map((s) => (
              <tr key={s.sale_id}>
                <td>{new Date(s.created_at).toLocaleString()}</td>
                <td>{s.payment_method.toUpperCase()}</td>
                <td>KES {s.total_amount.toFixed(2)}</td>
                <td>{s.sale_id}</td>
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
      {sales.length === 0 && (
        <p className="text-muted">No sales found</p>
      )}

      {sales.map((s) => (
        <div key={s.sale_id} className="card flex flex-col gap-xs">
          <div className="text-sm">
            <strong>Date:</strong> {new Date(s.created_at).toLocaleString()}
          </div>

          <div className="text-sm">
            <strong>Method:</strong> {s.payment_method.toUpperCase()}
          </div>

          <div className="text-sm text-bold">
            KES {s.total_amount.toFixed(2)}
          </div>

          <div className="text-xs text-muted">
            ID: {s.sale_id}
          </div>
        </div>
      ))}
    </div>

  </section>
);

}
