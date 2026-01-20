import { useEffect, useState } from "react";
import styles from "../dashboard/layout/DashboardLayout.module.css";

export default function AllSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:5000/api/sales/owner";

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(API_URL, {
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
  }, []);

  if (loading) return <p>Loading sales...</p>;
  if (error) return <p className={styles.message}>{error}</p>;

  return (
    <section className={styles["stock-history-card"]}>
      <div style={{ marginBottom: "1rem" }}>
        <h3>Sales History</h3>
      </div>

      {sales.length === 0 ? (
        <p>No sales found.</p>
      ) : (
        <table className={styles["stock-history-table"]}>
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Staff</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale.sale_id}>
                <td>{sale.sale_id}</td>
                <td>{sale.staff || "—"}</td>
                <td>
                  {Array.isArray(sale.items) && sale.items.length > 0 ? (
                    <pre style={{ margin: 0 }}>
{sale.items
  .map(
    (item) =>
      `${item.name} — ${item.quantity} × KES ${item.unit_price.toFixed(
        2
      )} = KES ${item.line_total.toFixed(2)}`
  )
  .join("\n")}
                    </pre>
                  ) : (
                    <em>No items</em>
                  )}
                </td>
                <td>KES {sale.total_amount.toFixed(2)}</td>
                <td>
                  {new Date(sale.created_at).toLocaleString("en-KE", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
