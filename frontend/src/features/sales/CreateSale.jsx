import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Sales.module.css";
import CreateCustomer from "../customers/CreateCustomer";
import CustomerSelector from "./CustomerSelector";
import PaymentSelector from "./PaymentSelector";

export default function CreateSale() {
  const { user } = useAuth();

  const [stockItems, setStockItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;
  const PAYMENT_METHODS = ["Cash", "M-Pesa", "Credit"];
  const isConfirmDisabled =
  loading ||
  selectedItems.length === 0 ||
  !paymentMethod ||
  (paymentMethod === "Credit" && !selectedCustomer);



  /* =======================
     DATA FETCHING
  ======================= */

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

  // useEffect(() => {
  //   if (paymentMethod === "Credit") {
  //     fetchDebtors();
  //   }
  // }, [paymentMethod]);

  // const fetchDebtors = async () => {
  //   const token = localStorage.getItem("token");

  //   try {
  //     const res = await fetch(`${API_BASE}/api/customers/debtors`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.error || "Failed to fetch debtors");

  //     setCustomers(Array.isArray(data) ? data : []);
  //   } catch (err) {
  //     setMessage(err.message);
  //   }
  // };

  useEffect(() => {
    if (paymentMethod === "Credit") {
      fetchCustomers();
    }
  }, [paymentMethod]);

  const fetchCustomers = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch customers");

      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage(err.message);
    }
  };

  /* =======================
     SEARCH
  ======================= */

  const filteredStock = stockItems.filter((s) =>
    `${s.name} ${s.sku || ""}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 🔥 STOP form submission

      if (filteredStock.length > 0) {
        addItem(filteredStock[0]);
        setSearchTerm("");
      }
    }
  };

  /* =======================
     CART LOGIC
  ======================= */

  const addItem = (stock) => {
    const price = Number(stock.selling_price ?? stock.unit_price ?? 0);

    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.stock_id === stock.id);

      if (existing) {
        return prev.map((i) =>
          i.stock_id === stock.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }

      return [
        ...prev,
        {
          stock_id: stock.id,
          sku: stock.sku,
          name: stock.name,
          category: stock.category,
          quantity: 1,
          selling_price: price, // 🔒 always a number
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

  const removeItem = (index) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = selectedItems.reduce(
    (sum, i) => sum + i.selling_price * i.quantity,
    0,
  );

  /* =======================
     SUBMIT SALE
  ======================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPaymentError("");
    setMessage("");

    if (!paymentMethod) {
      setPaymentError("Please select a payment method to continue.");
      return;
    }

    if (paymentMethod === "Credit" && !selectedCustomer) {
      setPaymentError("Please select a customer for credit sales.");
      return;
    }

    if (selectedItems.length === 0) {
      setMessage("Add at least one item");
      return;
    }

    setLoading(true);
    setLowStockAlert([]);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        items: selectedItems.map((i) => ({
          stock_id: i.stock_id,
          quantity: i.quantity,
          price: i.selling_price, // 🔥 explicit selling price
        })),
        paymentMethod,
        ...(paymentMethod === "Credit" && {
          customer_id: selectedCustomer,
        }),
      };

      const res = await fetch(`${API_BASE}/api/sales`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sale failed");

      if (Array.isArray(data.low_stock_items)) {
        setLowStockAlert(data.low_stock_items);
      }

      setSelectedItems([]);
      setSelectedCustomer("");
      setMessage(`Sale completed — Total KES ${data.total_amount}`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     UI
  ======================= */

  return (
    <section className={styles.posLayout}>
      {/* LEFT: PAYMENT */}
      <aside className={styles.paymentPanel}>
  <h3>Choose Payment</h3>

  <PaymentSelector
    value={paymentMethod}
    methods={PAYMENT_METHODS}
    styles={styles}
    onChange={setPaymentMethod}
    clearError={() => setPaymentError("")}
  />

  {paymentError && (
  <p className={styles.paymentError}>{paymentError}</p>
)}


  {paymentMethod === "Credit" && (
    <CustomerSelector
      customers={customers}
      selectedCustomer={selectedCustomer}
      setSelectedCustomer={setSelectedCustomer}
      onAddCustomer={() => setShowCustomerModal(true)}
      styles={styles}
    />
  )}

  <div className={styles.cartSummary}>
    <span>{selectedItems.length} items</span>
    <strong>KES {total.toFixed(2)}</strong>
  </div>

  {/* <button
    onClick={handleSubmit}
    disabled={
      loading ||
      !paymentMethod ||
      (paymentMethod === "Credit" && !selectedCustomer)
    }
    className={styles.confirmButton}
  >
    {loading ? "Processing…" : "Confirm Sale"}
  </button> */}

  <button
  type="button"
  onClick={handleSubmit}
  disabled={isConfirmDisabled}
  className={styles.confirmButton}
>
  {loading ? "Processing…" : "Confirm Sale"}
</button>

</aside>


      {/* RIGHT: CART */}
      <form className={styles.cartPanel} onSubmit={handleSubmit}>
        <div className={styles.searchBar}>
          <input
            autoFocus
            type="text"
            placeholder="Scan barcode or search item"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />

          {/* <button type="submit">
            <FaSearch />
          </button> */}

          {searchTerm && (
            <div className={styles.searchResults}>
              <div className={styles.searchHeader}>
                <span>SKU</span>
                <span>Item</span>
                <span>Price</span>
                <span>Qty</span>
              </div>

              {filteredStock.slice(0, 6).map((s) => (
                <div
                  key={s.id}
                  className={styles.searchRow}
                  onClick={() => {
                    addItem(s);
                    setSearchTerm("");
                  }}
                >
                  {" "}
                  <span className={styles.resSku}>{s.sku || "—"}</span>
                  <span className={styles.resName}>{s.name}</span>
                  <span className={styles.resPrice}>
                    KES{" "}
                    {(Number(s.selling_price ?? s.unit_price) || 0).toFixed(2)}
                  </span>
                  <span className={styles.resQuantity}>{s.quantity}</span>
                </div>
              ))}
              {filteredStock.length === 0 && (
                <div className={styles.noResult}>No items found</div>
              )}
            </div>
          )}
        </div>

        <div className={styles.cartTableWrapper}>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>SKU Number</th>
                <th>Item Name</th>
                <th>Item Category</th>
                <th>Quantityy</th>
                <th>Item Price</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((i, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{i.sku || "—"}</td>
                  <td>{i.name}</td>
                  <td>{i.category || "—"}</td>
                  <td>
                    <div className={styles.qtyControl}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, i.quantity - 1)}
                      >
                        −
                      </button>
                      <span>{i.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, i.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>KES {(Number(i.selling_price) || 0).toFixed(2)}</td>
                  <td>
                    <strong>
                      KES{" "}
                      {((Number(i.selling_price) || 0) * i.quantity).toFixed(2)}
                    </strong>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeItem(idx)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
      {/* {showCustomerModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <CreateCustomer
              onClose={() => setShowCustomerModal(false)}
              onSuccess={(newCustomer) => {
                fetchDebtors(); // 🔥 refresh list
                setSelectedCustomer(newCustomer.id); // auto select
              }}
            />
          </div>
        </div>
      )} */}

      {showCustomerModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            {/* Close button */}
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setShowCustomerModal(false)}
            >
              ✕
            </button>

            <CreateCustomer
              onClose={() => setShowCustomerModal(false)}
              onSuccess={(newCustomer) => {
                fetchCustomers(); // refresh list
                setSelectedCustomer(newCustomer.id); // auto select
                setShowCustomerModal(false); // close after success
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
