// frontend/src/features/sales/CreateSale.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Sales.module.css";

export default function CreateSale() {
  const { user } = useAuth();
  const [stockItems, setStockItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [message, setMessage] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
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

  // Fetch debtors only when Credit is selected
  useEffect(() => {
    if (paymentMethod !== "Credit") return;

    const fetchDebtors = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE}/api/customers/debtors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch debtors");

        const activeDebtors = Array.isArray(data)
          ? data.filter((c) => c.balance > 0)
          : [];
        setCustomers(activeDebtors);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchDebtors();
  }, [API_BASE, paymentMethod]);

  // Stock filtering & pagination
  const filteredStock = stockItems.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
          i.stock_id === stock.id ? { ...i, quantity: i.quantity + 1 } : i,
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
      prev.map((i, idx) => (idx === index ? { ...i, quantity: qty } : i)),
    );
  };

  const removeItem = (index) =>
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));

  const total = selectedItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0,
  );

  // Handle sale submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0)
      return setMessage("Select at least one item");
    if (paymentMethod === "Credit" && !selectedCustomer)
      return setMessage("Select a customer for credit sale");

    setLoading(true);
    setMessage("");
    setLowStockAlert([]);
    try {
      const token = localStorage.getItem("token");
      const payload = { items: selectedItems, paymentMethod };
      if (paymentMethod === "Credit") payload.customer_id = selectedCustomer;

      const res = await fetch(`${API_BASE}/api/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sale creation failed");

      // Show low stock alerts
      if (
        Array.isArray(data.low_stock_items) &&
        data.low_stock_items.length > 0
      ) {
        setLowStockAlert(data.low_stock_items);
      }

      setMessage(
        `Sale created successfully! Total: KES ${data.total_amount}${
          data.customer ? ` | Customer: ${data.customer}` : ""
        }`,
      );
      setSelectedItems([]);
      setSelectedCustomer("");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <section className={styles["sales-card"]}>
    //   <h2>Create Sale</h2>

    //   {/* Search */}
    //   <input
    //     type="text"
    //     placeholder="Search stock..."
    //     value={searchTerm}
    //     autoFocus
    //     onChange={(e) => setSearchTerm(e.target.value)}
    //     className={styles.searchInput}
    //   />

    //   {/* Stock List */}
    //   <div className={styles["card"]}>
    //     <h3>Available Stock</h3>
    //     {currentStock.length === 0 ? (
    //       <p>No stock items found</p>
    //     ) : (
    //       <table className={styles["stock-table"]}>
    //         <thead>
    //           <tr>
    //             <th>Name</th>
    //             <th>Price</th>
    //             <th>Qty Available</th>
    //             <th>Add</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {currentStock.map((s) => (
    //             <tr key={s.id}>
    //               <td>{s.name}</td>
    //               <td>KES {s.unit_price.toFixed(2)}</td>
    //               <td>{s.quantity}</td>
    //               <td>
    //                 <button
    //                   onClick={() => addItem(s)}
    //                   disabled={s.quantity === 0}
    //                 >
    //                   {s.quantity === 0 ? "Out of Stock" : "Add"}
    //                 </button>
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     )}

    //     {/* Pagination */}
    //     {totalPages > 1 && (
    //       <div className={styles.pagination}>
    //         <button
    //           onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
    //           disabled={currentPage === 1}
    //         >
    //           Prev
    //         </button>
    //         <span>
    //           Page {currentPage} of {totalPages}
    //         </span>
    //         <button
    //           onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
    //           disabled={currentPage === totalPages}
    //         >
    //           Next
    //         </button>
    //       </div>
    //     )}
    //   </div>

    //   {/* Selected Items */}
    //   <form onSubmit={handleSubmit} className={styles["card"]}>
    //     <h3>Selected Items</h3>
    //     {selectedItems.length === 0 ? (
    //       <p>No items selected</p>
    //     ) : (
    //       <table className={styles["stock-table"]}>
    //         <thead>
    //           <tr>
    //             <th>Name</th>
    //             <th>Quantity</th>
    //             <th>Unit Price</th>
    //             <th>Subtotal</th>
    //             <th>Remove</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {selectedItems.map((item, i) => (
    //             <tr key={i}>
    //               <td>{item.name}</td>
    //               <td>
    //                 <div className={styles.qtyControl}>
    //                   <button
    //                     type="button"
    //                     onClick={() => updateQuantity(i, item.quantity - 1)}
    //                     disabled={item.quantity === 1}
    //                   >
    //                     −
    //                   </button>
    //                   <span className={styles.qtyValue}>{item.quantity}</span>
    //                   <button
    //                     type="button"
    //                     onClick={() => updateQuantity(i, item.quantity + 1)}
    //                   >
    //                     +
    //                   </button>
    //                 </div>
    //               </td>
    //               <td>KES {item.unit_price.toFixed(2)}</td>
    //               <td>KES {(item.unit_price * item.quantity).toFixed(2)}</td>
    //               <td>
    //                 <button type="button" onClick={() => removeItem(i)}>
    //                   Remove
    //                 </button>
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     )}

    //     {/* Cart Summary */}
    //     <div className={styles.cartSummary}>
    //       <p>
    //         {selectedItems.length} item(s) | Total: KES {total.toFixed(2)}
    //       </p>
    //     </div>

    //     {/* Payment Method */}
    //     <div className={styles.paymentMethods}>
    //       <p>Select Payment Method</p>
    //       <div className={styles.paymentButtons}>
    //         <button type="button" onClick={() => setPaymentMethod("Cash")}>
    //           Cash
    //         </button>
    //         <button type="button" onClick={() => setPaymentMethod("M-Pesa")}>
    //           M-Pesa
    //         </button>
    //         <button type="button" onClick={() => setPaymentMethod("Credit")}>
    //           Credit
    //         </button>
    //       </div>

    //       {/* Customer Selector for Credit */}
    //       {paymentMethod === "Credit" && (
    //         <div className={styles.customerSelector}>
    //           <label>Select Customer:</label>
    //           <select
    //             value={selectedCustomer}
    //             onChange={(e) => setSelectedCustomer(e.target.value)}
    //           >
    //             <option value="">--Select Customer--</option>
    //             {customers.map((c) => (
    //               <option key={c.id} value={c.id}>
    //                 {c.full_name} | Owes: KES {c.balance.toFixed(2)}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //       )}
    //     </div>

    //     {/* Confirm Sale */}
    //     <button type="submit" disabled={loading} className={styles.confirmButton}>
    //       {loading ? "Submitting..." : "Confirm Sale"}
    //     </button>
    //   </form>

    //   {/* Messages */}
    //   {message && <p className={styles.message}>{message}</p>}

    //   {/* Low stock alerts */}
    //   {lowStockAlert.length > 0 && (
    //     <div className={styles.lowStockAlert}>
    //       <h4>⚠ Low Stock Alert</h4>
    //       <ul>
    //         {lowStockAlert.map((item) => (
    //           <li key={item.id}>
    //             {item.name} — Remaining: {item.quantity}
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}
    // </section>

    <section className={styles.posLayout}>
      {/* LEFT — Payment Panel */}
      <aside className={styles.paymentPanel}>
        <h3>Payment</h3>

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
            <label>Select Customer</label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">--Select--</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} | Owes: KES {c.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.cartSummary}>
          {selectedItems.length} item(s)
          <br />
          <strong>KES {total.toFixed(2)}</strong>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={styles.confirmButton}
        >
          {loading ? "Submitting..." : "Confirm Sale"}
        </button>
      </aside>

      {/* RIGHT — Stock + Search */}
      <div className={styles.stockPanel}>
        <input
          type="text"
          placeholder="Search stock..."
          value={searchTerm}
          autoFocus
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        {/* scrollable table */}
        <div className={styles.stockTableWrapper}>
          <table className={styles["stock-table"]}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
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
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination stays fixed at bottom */}
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
      

      {/* BOTTOM — Cart */}
      <form onSubmit={handleSubmit} className={styles.cartPanel}>
        <h3>Items in Sale</h3>

        <div className={styles.cartScroll}>
          <table className={styles["stock-table"]}>
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
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(i, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>KES {(item.unit_price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button type="button" onClick={() => removeItem(i)}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </section>
  );
}
