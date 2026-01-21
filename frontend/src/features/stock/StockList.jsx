//frontend/src/features/stock/StockList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../dashboard/layout/DashboardLayout.module.css";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function StockList() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;
  const API_URL = `${API_BASE}/api/stock`;

  // Fetch stock items
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load stock");

        setStock(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [API_URL]);

  // Delete stock item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete stock");

      setStock((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      // Show UX-friendly message
      if (err.message.includes("linked to existing sales")) {
        alert(
          "Cannot delete this stock item because it is linked to existing sales. Consider reducing its quantity or marking it inactive instead.",
        );
      } else {
        alert(`Failed to delete stock: ${err.message}`);
      }
      console.error(err);
    }
  };

  if (loading) return <p>Loading stock...</p>;
  if (error) return <p className={styles.message}>{error}</p>;

  return (
    <section className={styles["stock-history-card"]}>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Stock Inventory</h3>
        <Link to="/owner/stock/add" title="Add Stock">
          <button className={styles.iconBtn}>
            <FiPlus /> Add Stock
          </button>
        </Link>
      </div>

      {stock.length === 0 ? (
        <p>No stock items found.</p>
      ) : (
        <table className={styles["stock-history-table"]}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Minimum stock level</th>
              <th>Price per item</th>
              <th>Status</th>
              <th>Actions</th>
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
                  <td className={styles.actionsCell}>
                    {/* Edit */}
                    <Link
                      to={`/owner/stock/${item.id}/edit`}
                      title="Edit stock"
                    >
                      <button className={styles.iconBtn}>
                        <FiEdit />
                      </button>
                    </Link>

                    {/* Delete */}
                    <button
                      className={`${styles.iconBtn} ${styles.danger}`}
                      title="Delete stock"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FiTrash2 />
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
