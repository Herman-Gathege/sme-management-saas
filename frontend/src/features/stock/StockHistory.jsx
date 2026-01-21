// frontend/src/features/stock/StockHistory.jsx
import { useEffect, useState } from "react";
import styles from "../dashboard/layout/DashboardLayout.module.css";

export default function StockHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(`${API_BASE}/api/stock/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch stock history");

        const data = await res.json();

        // Transform details to readable text
        const transformed = data.map((h) => ({
          ...h,
          detailsText: h.details
            ? Object.entries(h.details)
                .map(
                  ([key, value]) =>
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
  if (error) return <p className={styles.message}>{error}</p>;

  return (
    <section className={styles["stock-history-card"]}>
      <h3>Stock History</h3>
      {history.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        <table className={styles["stock-history-table"]}>
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
            {history.map((h) => (
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
      )}
    </section>
  );
}
