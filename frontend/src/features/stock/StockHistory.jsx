import { useEffect, useState } from "react";
import styles from "../dashboard/layout/DashboardLayout.module.css";

export default function StockHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:5000/api/stock/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch stock history");

        setHistory(data);
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
    <section className={styles.card}>
      <h3>Stock History</h3>
      {history.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "1rem" }}>
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
                <td>
                  <pre style={{ margin: 0 }}>
                    {JSON.stringify(h.details, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
