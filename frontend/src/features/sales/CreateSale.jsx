//frontend/src/features/sales/CreateSale.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CreateCustomer from "../customers/CreateCustomer";
import CustomerSelector from "./CustomerSelector";
import PaymentSelector from "./PaymentSelector";
import { apiFetch } from "../../api/client";


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
    try {
      const res = await apiFetch("/api/stock/staff");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch stock");

      setStockItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage(err.message);
    }
  };

  fetchStock();
}, []);


 

  useEffect(() => {
    if (paymentMethod === "Credit") {
      fetchCustomers();
      setSelectedCustomer("");
    }
  }, [paymentMethod]);

  


  const fetchCustomers = async () => {
  try {
    const res = await apiFetch("/api/customers");
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

    if (loading) return;


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

      const res = await apiFetch("/api/sales", {
        method: "POST",
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
    <section className="pos-layout">
  {/* LEFT: PAYMENT */}
  <aside className="payment-panel">
    <h3>Choose Payment</h3>

    <PaymentSelector
      value={paymentMethod}
      methods={PAYMENT_METHODS}
      onChange={setPaymentMethod}
      clearError={() => setPaymentError("")}
    />

    {paymentError && <p className="payment-error">{paymentError}</p>}

    {paymentMethod === "Credit" && (
      <CustomerSelector
        customers={customers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        onAddCustomer={() => setShowCustomerModal(true)}
      />
    )}

    <div className="cart-summary">
      <span>{selectedItems.length} items</span>
      <strong>KES {total.toFixed(2)}</strong>
    </div>

    <button
      type="button"
      onClick={handleSubmit}
      disabled={isConfirmDisabled}
      className="btn primary-btn"
    >
      {loading ? "Processing…" : "Confirm Sale"}
    </button>
  </aside>

  {/* RIGHT: CART */}
  <form className="cart-panel" onSubmit={handleSubmit}>
    <div className="search-bar">
      <input
        autoFocus
        type="text"
        placeholder="Scan barcode or search item"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearchKeyDown}
      />

      {searchTerm && (
        <div className="search-results">
          <div className="search-header">
            <span>SKU</span>
            <span>Item</span>
            <span>Price</span>
            <span>Qty</span>
          </div>

          {filteredStock.slice(0, 6).map((s) => (
            <div
              key={s.id}
              className="search-row"
              onClick={() => {
                addItem(s);
                setSearchTerm("");
              }}
            >
              <span>{s.sku || "—"}</span>
              <span>{s.name}</span>
              <span>
                KES{" "}
                {(Number(s.selling_price ?? s.unit_price) || 0).toFixed(2)}
              </span>
              <span>{s.quantity}</span>
            </div>
          ))}

          {filteredStock.length === 0 && (
            <div className="no-result">No items found</div>
          )}
        </div>
      )}
    </div>

    <div className="cart-table-wrapper">
      <table className="cart-table">
        <thead>
          <tr>
            <th>#</th>
            <th>SKU</th>
            <th>Item</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Price</th>
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
                <div className="qty-control">
                  <button type="button" onClick={() => updateQuantity(idx, i.quantity - 1)}>
                    −
                  </button>
                  <span>{i.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(idx, i.quantity + 1)}>
                    +
                  </button>
                </div>
              </td>
              <td>KES {(Number(i.selling_price) || 0).toFixed(2)}</td>
              <td>
                <strong>
                  KES {(i.selling_price * i.quantity).toFixed(2)}
                </strong>
              </td>
              <td>
                <button
                  type="button"
                  className="remove-btn"
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

  {showCustomerModal && (
    <div className="modal-backdrop">
      <div className="modal">
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setShowCustomerModal(false)}
        >
          ✕
        </button>

        <CreateCustomer
          onClose={() => setShowCustomerModal(false)}
          onSuccess={(newCustomer) => {
            fetchCustomers();
            setSelectedCustomer(newCustomer.id);
            setShowCustomerModal(false);
          }}
        />
      </div>
    </div>
  )}
</section>

  );
}
