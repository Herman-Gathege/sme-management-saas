// frontend/src/features/sales/CreateSale.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Sales.module.css";

export default function CreateSale() {
  const { user } = useAuth();
  const [stockItems, setStockItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Fetch available stock
  // -----------------------------
  useEffect(() => {
    const fetchStock = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:5000/api/stock/staff", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("Stock API response:", data);

        if (!res.ok) throw new Error(data.error || "Failed to fetch stock");

        setStockItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setMessage(err.message);
      }
    };

    fetchStock();
  }, []);

  // Add state for search
const [searchTerm, setSearchTerm] = useState("");

// Filtered stock items based on search
const filteredStock = stockItems.filter((s) =>
  s.name.toLowerCase().includes(searchTerm.toLowerCase())
);


  // -----------------------------
  // Add stock item to sale
  // -----------------------------
  const addItem = (stock) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.stock_id === stock.id);
      if (exists) {
        return prev.map((i) =>
          i.stock_id === stock.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        { stock_id: stock.id, name: stock.name, quantity: 1, unit_price: stock.unit_price },
      ];
    });
  };

  // -----------------------------
  // Update quantity of selected item
  // -----------------------------
  const updateQuantity = (index, qty) => {
    if (qty < 1) return;
    setSelectedItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item))
    );
  };

  // -----------------------------
  // Remove item from selection
  // -----------------------------
  const removeItem = (index) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  // -----------------------------
  // Calculate total
  // -----------------------------
  const total = selectedItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  // -----------------------------
  // Submit sale
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setMessage("Select at least one item for sale");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: selectedItems }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sale creation failed");

      setMessage(`Sale created successfully! Total: $${data.total_amount}`);
      setSelectedItems([]);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.salesContainer}>
      <h2>Create Sale</h2>

      {/* Search Bar */}
<input
  type="text"
  placeholder="Search stock..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className={styles.searchInput}
/>

{/* Available Stock */}
<section className={styles.stockList}>
  <h3>Available Stock</h3>
  {filteredStock.map((s) => (
  <div key={s.id} className={styles.stockRow}>
    <span>{s.name}</span>
    <span>@ KES {s.unit_price}</span>
    <span className={styles.remainingStock}>In Stock: {s.quantity}</span>  {/* <-- NEW */}
    <button onClick={() => addItem(s)} disabled={s.quantity === 0}>
      {s.quantity === 0 ? "Out of Stock" : "Add"}
    </button>
  </div>
))}

</section>


      {/* Selected Items */}
      <form onSubmit={handleSubmit} className={styles.saleForm}>
        <h3>Selected Items</h3>
        {selectedItems.length === 0 ? (
          <p>No items selected</p>
        ) : (
          selectedItems.map((item, i) => (
            <div key={i} className={styles.selectedRow}>
              <span>{item.name}</span>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(i, parseInt(e.target.value))}
              />
              <span>${item.unit_price}</span>
              <span>Subtotal: ${(item.unit_price * item.quantity).toFixed(2)}</span>
              <button type="button" onClick={() => removeItem(i)}>Remove</button>
            </div>
          ))
        )}

        {/* Total */}
        <h3>Total: ${total.toFixed(2)}</h3>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Sale"}
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
