import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../dashboard/layout/DashboardLayout.module.css";

export default function StockList() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:5000/api/stock/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Failed to load stock");

        setStock(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  // Handle delete stock item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/api/stock/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete stock");

      // Remove deleted item from state
      setStock((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading stock...</p>;
  if (error) return <p className={styles.message}>{error}</p>;

  return (
    <section className={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Stock Inventory</h3>
        <Link to="/stock/add">
          <button>Add Stock</button>
        </Link>
      </div>

      {stock.length === 0 ? (
        <p>No stock items found.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Min</th>
              <th>Unit Price</th>
              <th>Status</th>
              <th>Actions</th> {/* NEW */}
            </tr>
          </thead>

          <tbody>
            {stock.map((item) => {
              const isLow = item.quantity <= item.min_stock_level;

              return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.sku || "—"}</td>
                  <td>{item.category || "—"}</td>
                  <td>{item.quantity}</td>
                  <td>{item.min_stock_level}</td>
                  <td>KES {item.unit_price.toFixed(2)}</td>
                  <td>
                    {isLow ? (
                      <span style={{ color: "red" }}>Low Stock</span>
                    ) : (
                      <span style={{ color: "green" }}>OK</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/stock/${item.id}/edit`}>
                      <button>Edit</button>
                    </Link>
                    <button
                      style={{
                        marginLeft: "0.5rem",
                        backgroundColor: "red",
                        color: "#fff",
                      }}
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
