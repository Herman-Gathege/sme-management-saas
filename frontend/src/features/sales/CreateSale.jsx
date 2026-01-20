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
  const itemsPerPage = 5;

  // Fetch stock
  useEffect(() => {
    const fetchStock = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:5000/api/stock/staff", {
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
  }, []);

  const filteredStock = stockItems.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStock = filteredStock.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);

  const addItem = (stock) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.stock_id === stock.id);
      if (exists) return prev.map((i) => (i.stock_id === stock.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { stock_id: stock.id, name: stock.name, quantity: 1, unit_price: stock.unit_price }];
    });
  };

  const updateQuantity = (index, qty) => { if (qty < 1) return; setSelectedItems(prev => prev.map((i, idx) => idx === index ? {...i, quantity: qty} : i)); };
  const removeItem = (index) => setSelectedItems(prev => prev.filter((_, i) => i !== index));
  const total = selectedItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) return setMessage("Select at least one item");

    setLoading(true); setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: selectedItems }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sale creation failed");
      setMessage(`Sale created successfully! Total: KES ${data.total_amount}`);
      setSelectedItems([]);
    } catch (err) { setMessage(err.message); }
    finally { setLoading(false); }
  };

  return (
    <section className={styles["sales-card"]}>
      <h2>Create Sale</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search stock..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {/* Stock List */}
      <div className={styles["card"]}>
        <h3>Available Stock</h3>
        {currentStock.length === 0 ? <p>No stock items found</p> :
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
                    <button onClick={() => addItem(s)} disabled={s.quantity === 0}>
                      {s.quantity === 0 ? "Out of Stock" : "Add"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}
      </div>

      {/* Selected Items */}
      <form onSubmit={handleSubmit} className={styles["card"]}>
        <h3>Selected Items</h3>
        {selectedItems.length === 0 ? <p>No items selected</p> :
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
                    <input type="number" min="1" value={item.quantity}
                      onChange={(e) => updateQuantity(i, parseInt(e.target.value))} />
                  </td>
                  <td>KES {item.unit_price.toFixed(2)}</td>
                  <td>KES {(item.unit_price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button type="button" onClick={() => removeItem(i)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }

        <h3>Total: KES {total.toFixed(2)}</h3>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Sale"}
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </section>
  );
}
