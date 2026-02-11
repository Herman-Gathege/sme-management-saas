// frontend/src/features/stock/StockList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../api/client";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function StockList() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 

  // Fetch stock items
  useEffect(() => {
    const fetchStock = async () => {
      try {
        

        const res = await apiFetch("/api/stock" );


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
  }, []);

  // Delete stock item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await apiFetch(`/api/stock/${id}`, {
        method: "DELETE",
      });


      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete stock");

      setStock((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
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
  if (error) return <p className="text-error">{error}</p>;

  return (
    <section className="card">
      <div className="customers-header">
        <h3>Stock Inventory</h3>
        <Link to="/owner/stock/add" title="Add Stock">
          <button className="btn btn-primary mb-sm">
            <FiPlus /> Add Stock
          </button>
        </Link>
      </div>

      {stock.length === 0 ? (
        <p>No stock items found.</p>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="customers-table-wrapper stock-table-wrapper hidden-on-mobile">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Minimum stock level</th>
                  <th>Buying Price</th>
                  <th>Selling Price</th>
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
                      <td>
                        {item.unit_price
                          ? `KES ${item.unit_price.toFixed(2)}`
                          : "—"}
                      </td>
                      <td>
                        {item.selling_price
                          ? `KES ${item.selling_price.toFixed(2)}`
                          : "—"}
                      </td>
                      <td>
                        <span
                          className={
                            isLow
                              ? "status-pill status-owed"
                              : "status-pill status-ok"
                          }
                        >
                          {isLow ? "Low Stock" : "OK"}
                        </span>
                      </td>
                      <td>
                        <Link to={`/owner/stock/${item.id}/edit`}>
                          <button className="icon-btn" title="Edit">
                            <FiEdit />
                          </button>
                        </Link>

                        <button
                          className="icon-btn"
                          title="Delete"
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
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="stock-cards hidden-on-desktop">
            {stock.map((item) => {
              const isLow = item.quantity <= item.min_stock_level;

              return (
                <div key={item.id} className="card stock-card">
                  <div className="stock-card-header">
                    <strong>{item.name}</strong>
                    <span
                      className={
                        isLow
                          ? "status-pill status-owed"
                          : "status-pill status-ok"
                      }
                    >
                      {isLow ? "Low Stock" : "OK"}
                    </span>
                  </div>

                  <div className="stock-card-body">
                    <div>
                      <span>SKU:</span> {item.sku || "—"}
                    </div>
                    <div>
                      <span>Category:</span> {item.category || "—"}
                    </div>
                    <div>
                      <span>Quantity:</span> {item.quantity}
                    </div>
                    <div>
                      <span>Min Level:</span> {item.min_stock_level}
                    </div>
                    <div>
                      <span>Buying:</span>{" "}
                      {item.unit_price
                        ? `KES ${item.unit_price.toFixed(2)}`
                        : "—"}
                    </div>
                    <div>
                      <span>Selling:</span>{" "}
                      {item.selling_price
                        ? `KES ${item.selling_price.toFixed(2)}`
                        : "—"}
                    </div>
                  </div>

                  <div className="stock-card-actions">
                    <Link to={`/owner/stock/${item.id}/edit`}>
                      <button className="icon-btn">
                        <FiEdit />
                      </button>
                    </Link>

                    <button
                      className="icon-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
