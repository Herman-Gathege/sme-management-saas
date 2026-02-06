import { useEffect, useState } from "react";
import styles from "../dashboard/layout/DashboardLayout.module.css";

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
  if (error) return <p className={styles.message}>{error}</p>;

  return (
    <section className={styles["stock-history-card"]}>
      <div className={styles["table-header"]}>
        <h3>Sales Reports</h3>
        <button className={styles.iconBtn} onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      {summary && (
        <div className={styles["summary-cards"]}>
          {["cash", "mpesa", "credit", "total"].map((key) => (
            <div key={key} className={styles["summary-card"]}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <br />
              <span>KES {summary[key].toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* FILTER BUTTONS */}
      <div className={styles["filter-buttons"]}>
        <button
          className={styles.iconBtn}
          onClick={() => setSelectedFilter("today")}
          disabled={selectedFilter === "today"}
        >
          Today
        </button>
        <button
          className={styles.iconBtn}
          onClick={() => setSelectedFilter("month")}
          disabled={selectedFilter === "month"}
        >
          This Month
        </button>
        <button
          className={styles.iconBtn}
          onClick={() => setSelectedFilter("all")}
          disabled={selectedFilter === "all"}
        >
          All Time
        </button>
      </div>

      <div className={styles["table-wrapper"]}>
        <table className={styles["stock-history-table"]}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Amount (KES)</th>
              <th>Sale ID</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((s) => (
                <tr key={s.sale_id}>
                  <td>{new Date(s.created_at).toLocaleString()}</td>
                  <td>{s.payment_method.toUpperCase()}</td>
                  <td>{s.total_amount.toFixed(2)}</td>
                  <td>{s.sale_id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles["no-data"]}>
                  No sales found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
