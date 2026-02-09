// frontend/src/features/suppliers/OwnerCreditors.jsx
import { useEffect, useState } from "react";
import { listPayments, createPayment } from "../../api/suppliers";
import "./SupplierModule.css";

export default function OwnerCreditors() {
  const [creditors, setCreditors] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expandedSupplierId, setExpandedSupplierId] = useState(null);
  const [showPaymentFormFor, setShowPaymentFormFor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newPayment, setNewPayment] = useState({
    supplier_id: "",
    amount: "",
    payment_method: "cash",
    notes: "",
  });

  const API_BASE = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // ---------------- Fetch Creditors ----------------
  const fetchCreditors = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/suppliers/creditors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch creditors");
      setCreditors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  // ---------------- Fetch Payments ----------------
  const fetchPayments = async () => {
    try {
      const data = await listPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCreditors(), fetchPayments()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // ---------------- Add Payment ----------------
  const handleAddPayment = async (supplierId) => {
    const amountNum = parseFloat(newPayment.amount);
    if (!amountNum || amountNum <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      await createPayment({
        supplier_id: supplierId,
        amount: amountNum,
        payment_method: newPayment.payment_method,
        notes: newPayment.notes,
      });

      setNewPayment({
        supplier_id: "",
        amount: "",
        payment_method: "cash",
        notes: "",
      });

      setShowPaymentFormFor(null);
      await fetchPayments();
      await fetchCreditors();
    } catch (err) {
      alert("Failed to add payment");
    }
  };

  const toggleExpand = (supplierId) => {
    setExpandedSupplierId(
      expandedSupplierId === supplierId ? null : supplierId
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (

    <div className="ownersuppliers-container">
      <h2>Suppliers you Owe Money</h2>

      <table className="creditors-table">
        <thead>
          <tr>
            <th></th>
            <th>Supplier</th>
            <th>Total Credit (KES)</th>
            <th>Total Paid (KES)</th>
            <th>Balance Due (KES)</th>
          </tr>
        </thead>
        <tbody>
          {creditors.map((c) => {
            const supplierPayments = payments.filter(
              (p) => p.supplier_id === c.supplier_id
            );

            return (
              <>
                <tr key={c.supplier_id} className="creditors-row">
                  <td
                    className="expand-toggle"
                    onClick={() => toggleExpand(c.supplier_id)}
                  >
                    {expandedSupplierId === c.supplier_id ? "▼" : "▶"}
                  </td>
                  <td>{c.supplier_name}</td>
                  <td>{c.total_credit.toFixed(2)}</td>
                  <td>{c.total_paid.toFixed(2)}</td>
                  <td className="balance-cell">
                    {c.balance_due.toFixed(2)}
                  </td>
                </tr>

                {expandedSupplierId === c.supplier_id && (
                  <tr className="expanded-row">
                    <td colSpan="5">
                      <div className="payments-section">
                        <h4>All Payments</h4>

                        <table className="payments-subtable">
                          <thead>
                            <tr>
                              <th>Supplier</th>
                              <th>Amount</th>
                              <th>Method</th>
                              <th>Notes</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {supplierPayments.length === 0 ? (
                              <tr>
                                <td colSpan="5">No payments found</td>
                              </tr>
                            ) : (
                              supplierPayments.map((p) => (
                                <tr key={p.id}>
                                  <td>{c.supplier_name}</td>
                                  <td>{p.amount}</td>
                                  <td>{p.payment_method}</td>
                                  <td>{p.notes}</td>
                                  <td>
                                    {new Date(
                                      p.created_at
                                    ).toLocaleString()}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>

                        {showPaymentFormFor === c.supplier_id ? (
                          <form
                            className="inline-payment-form"
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAddPayment(c.supplier_id);
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Amount"
                              value={newPayment.amount}
                              onChange={(e) =>
                                setNewPayment({
                                  ...newPayment,
                                  amount: e.target.value,
                                })
                              }
                              required
                            />

                            <select
                              value={newPayment.payment_method}
                              onChange={(e) =>
                                setNewPayment({
                                  ...newPayment,
                                  payment_method: e.target.value,
                                })
                              }
                            >
                              <option value="cash">Cash</option>
                              <option value="mpesa">Mpesa</option>
                              <option value="bank">Bank</option>
                            </select>

                            <input
                              placeholder="Notes"
                              value={newPayment.notes}
                              onChange={(e) =>
                                setNewPayment({
                                  ...newPayment,
                                  notes: e.target.value,
                                })
                              }
                            />

                            <button type="submit">Save Payment</button>
                          </form>
                        ) : (
                          <button
                            className="btn-add-payment"
                            onClick={() =>
                              setShowPaymentFormFor(c.supplier_id)
                            }
                          >
                            + Add Payment
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
