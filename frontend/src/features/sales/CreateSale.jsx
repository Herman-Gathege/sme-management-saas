import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Sales.module.css";

export default function CreateSale() {
  const { user } = useAuth();
  const [stockItems, setStockItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Cash"); // placeholder
  const itemsPerPage = 5;

  const API_BASE = import.meta.env.VITE_API_URL;

  // Fetch stock
  useEffect(() => {
    const fetchStock = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE}/api/stock/staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch stock");
        setStockItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchStock();
  }, [API_BASE]);

  // Stock filtering
  const filteredStock = stockItems.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStock = filteredStock.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);

  // Cart logic
  const addItem = (stock) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.stock_id === stock.id);
      if (exists)
        return prev.map((i) =>
          i.stock_id === stock.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [
        ...prev,
        {
          stock_id: stock.id,
          name: stock.name,
          quantity: 1,
          unit_price: stock.unit_price,
        },
      ];
    });
  };

  const updateQuantity = (index, qty) => {
    if (qty < 1) return;
    setSelectedItems((prev) =>
      prev.map((i, idx) => (idx === index ? { ...i, quantity: qty } : i))
    );
  };

  const removeItem = (index) =>
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));

  const total = selectedItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) return setMessage("Select at least one item");

    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: selectedItems, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sale creation failed");
      setMessage(`Sale created successfully! Total: KES ${data.total_amount}`);
      setSelectedItems([]);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles["sales-card"]}>
      <h2>Create Sale</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search stock..."
        value={searchTerm}
        autoFocus
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {/* Stock List */}
      <div className={styles["card"]}>
        <h3>Available Stock</h3>
        {currentStock.length === 0 ? (
          <p>No stock items found</p>
        ) : (
          <table className={styles["stock-table"]}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Qty Available</th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>
              {currentStock.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>KES {s.unit_price.toFixed(2)}</td>
                  <td>{s.quantity}</td>
                  <td>
                    <button
                      onClick={() => addItem(s)}
                      disabled={s.quantity === 0}
                    >
                      {s.quantity === 0 ? "Out of Stock" : "Add"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Selected Items */}
      <form onSubmit={handleSubmit} className={styles["card"]}>
        <h3>Selected Items</h3>
        {selectedItems.length === 0 ? (
          <p>No items selected</p>
        ) : (
          <table className={styles["stock-table"]}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>
                    <div className={styles.qtyControl}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(i, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >
                        −
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(i, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>KES {item.unit_price.toFixed(2)}</td>
                  <td>KES {(item.unit_price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button type="button" onClick={() => removeItem(i)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Cart Summary */}
        <div className={styles.cartSummary}>
          <p>
            {selectedItems.length} item(s) | Total: KES {total.toFixed(2)}
          </p>
        </div>

        {/* Payment Method */}
        <div className={styles.paymentMethods}>
          <p>Select Payment Method (placeholder)</p>
          <div className={styles.paymentButtons}>
            <button type="button" onClick={() => setPaymentMethod("Cash")}>
              Cash
            </button>
            <button type="button" onClick={() => setPaymentMethod("M-Pesa")}>
              M-Pesa
            </button>
            <button type="button" onClick={() => setPaymentMethod("Credit")}>
              Credit
            </button>
          </div>

          {paymentMethod === "Credit" && (
            <div className={styles.customerSelector}>
              <p>Customer selector placeholder</p>
            </div>
          )}
        </div>

        {/* Confirm Sale */}
        <button type="submit" disabled={loading} className={styles.confirmButton}>
          {loading ? "Submitting..." : "Confirm Sale"}
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </section>
  );
}
