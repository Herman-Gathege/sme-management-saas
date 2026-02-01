// frontend/src/features/customers/OwnerCustomers.jsx

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./Customers.module.css";

export default function OwnerCustomers() {
  const location = useLocation();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedRows, setExpandedRows] = useState({}); // key: customerId
  const [paymentsData, setPaymentsData] = useState({}); // customerId -> payments array
  const [loadingPayments, setLoadingPayments] = useState({}); // customerId -> bool
  const [paymentForm, setPaymentForm] = useState({}); // customerId -> {amount, method, notes}

  const API_BASE = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const isDebtors = location.pathname.includes("debtors");
  const roleEndpoint = isDebtors ? "debtors" : "creditors";

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/customers/${roleEndpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load customers");
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [API_BASE, roleEndpoint, token]);

  // Toggle row expansion
  const toggleRow = (customerId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [customerId]: !prev[customerId],
    }));

    // Fetch payments if opening
    if (!expandedRows[customerId]) {
      fetchPayments(customerId);
    }
  };

  // Fetch payments for a customer
  const fetchPayments = async (customerId) => {
    setLoadingPayments((prev) => ({ ...prev, [customerId]: true }));
    try {
      const res = await fetch(`${API_BASE}/api/payments/customer/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load payments");
      setPaymentsData((prev) => ({ ...prev, [customerId]: data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPayments((prev) => ({ ...prev, [customerId]: false }));
    }
  };

  // Handle payment form input change
  const handlePaymentInput = (customerId, field, value) => {
    setPaymentForm((prev) => ({
      ...prev,
      [customerId]: { ...prev[customerId], [field]: value },
    }));
  };

  // Submit payment
  const submitPayment = async (customerId) => {
    const form = paymentForm[customerId] || {};
    if (!form.amount || parseFloat(form.amount) <= 0) return alert("Amount must be positive");
    if (!form.payment_method) return alert("Select a payment method");

    try {
      const res = await fetch(`${API_BASE}/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_id: customerId,
          amount: parseFloat(form.amount),
          payment_method: form.payment_method,
          notes: form.notes || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record payment");

      // Refresh payments and update balance
      fetchPayments(customerId);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customerId
            ? { ...c, balance: (c.balance || 0) - parseFloat(form.amount) }
            : c
        )
      );

      // Clear form
      setPaymentForm((prev) => ({ ...prev, [customerId]: {} }));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{isDebtors ? "Debtors" : "Creditors"}</h2>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && customers.length === 0 && <p>No {isDebtors ? "debtors" : "creditors"} found.</p>}

      {!loading && customers.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Company</th>
              <th>{isDebtors ? "Amount Owed (KES)" : "Amount Payable (KES)"}</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => {
              const balance = Number(c.balance || 0);
              const isOwed = isDebtors && balance > 0;
              const [name, company] = c.full_name?.includes("(")
                ? c.full_name.split(" (")
                : [c.full_name, "-"];
              const expanded = expandedRows[c.id];

              return (
                <tr key={c.id}>
                  <td>
                    <button
                      className={styles.iconBtn}
                      onClick={() => toggleRow(c.id)}
                      title={expanded ? "Hide Payments" : "Show Payments"}
                    >
                      {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </td>
                  <td>{name || "-"}</td>
                  <td>{company ? company.replace(")", "") : "-"}</td>
                  <td className={styles.balance}>KES {balance.toFixed(2)}</td>
                  <td>
                    <span className={isOwed ? styles.statusOwed : styles.statusOk}>
                      {isOwed ? "OWED" : "OK"}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.iconBtn} title="Edit"><Pencil size={16} /></button>
                    <button className={styles.iconBtn} title="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              );
            })}

            {/* Expanded Payments Row */}
            {customers.map((c) => {
              const expanded = expandedRows[c.id];
              if (!expanded) return null;
              const payments = paymentsData[c.id] || [];
              const loadingPay = loadingPayments[c.id];

              return (
                <tr key={`payments-${c.id}`}>
                  <td colSpan={6}>
                    {loadingPay ? (
                      <p>Loading payments...</p>
                    ) : (
                      <>
                        <table className={`${styles.nestedTable}`} style={{ marginTop: "0.5rem" }}>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Amount (KES)</th>
                              <th>Method</th>
                              <th>Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.length === 0 ? (
                              <tr>
                                <td colSpan={4}>No payments yet</td>
                              </tr>
                            ) : (
                              payments.map((p) => (
                                <tr key={p.id}>
                                  <td>{new Date(p.created_at).toLocaleString()}</td>
                                  <td>{p.amount.toFixed(2)}</td>
                                  <td>{p.payment_method}</td>
                                  <td>{p.notes || "-"}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>

                        {/* Inline Payment Form */}
                        <div
                          className="paymentForm"
                          style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}
                        >
                          <input
                            type="number"
                            placeholder="Amount"
                            value={paymentForm[c.id]?.amount || ""}
                            onChange={(e) => handlePaymentInput(c.id, "amount", e.target.value)}
                          />
                          <select
                            value={paymentForm[c.id]?.payment_method || ""}
                            onChange={(e) => handlePaymentInput(c.id, "payment_method", e.target.value)}
                          >
                            <option value="">Method</option>
                            <option value="cash">Cash</option>
                            <option value="mpesa">MPESA</option>
                            <option value="bank">Bank</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Notes"
                            value={paymentForm[c.id]?.notes || ""}
                            onChange={(e) => handlePaymentInput(c.id, "notes", e.target.value)}
                          />
                          <button onClick={() => submitPayment(c.id)}>Add Payment</button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
