// frontend/src/features/customers/OwnerCustomers.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
// import MobileCardList from "../../components/ui/MobileCardList";

// import styles from "./Customers.module.css";

export default function OwnerCustomers() {
  const location = useLocation();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedRow, setExpandedRow] = useState(null); // single expanded row
  const [paymentsData, setPaymentsData] = useState({}); // customerId -> payments array
  const [loadingPayments, setLoadingPayments] = useState({}); // customerId -> bool
  const [paymentForm, setPaymentForm] = useState({}); // customerId -> {amount, method, notes}

  const API_BASE = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const isDebtors = location.pathname.includes("debtors");
  const isAll = location.pathname.includes("all");
  const roleEndpoint = isAll ? "" : isDebtors ? "debtors" : "creditors";

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError("");
      try {
        const url = roleEndpoint
          ? `${API_BASE}/api/customers/${roleEndpoint}`
          : `${API_BASE}/api/customers`;
        const res = await fetch(url, {
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
    setExpandedRow((prev) => (prev === customerId ? null : customerId));

    // Fetch payments if opening
    if (expandedRow !== customerId) {
      fetchPayments(customerId);
    }
  };

  // Fetch payments for a customer
  const fetchPayments = async (customerId) => {
    setLoadingPayments((prev) => ({ ...prev, [customerId]: true }));
    try {
      const res = await fetch(
        `${API_BASE}/api/customers/payments/customer/${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
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
    if (!form.amount || parseFloat(form.amount) <= 0)
      return alert("Amount must be positive");
    if (!form.payment_method) return alert("Select a payment method");

    try {
      const res = await fetch(`${API_BASE}/api/customers/payments`, {
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
            : c,
        ),
      );

      // Clear form
      setPaymentForm((prev) => ({ ...prev, [customerId]: {} }));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h2 className="text-lg text-bold">
          {isDebtors ? "Debtors" : "Creditors"}
        </h2>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-error">{error}</p>}
      {!loading && customers.length === 0 && (
        <p>No {isDebtors ? "debtors" : "creditors"} found.</p>
      )}

      {!loading && customers.length > 0 && (
        <div className="customers-table-wrapper hidden-mobile">
          <table className="customers-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Company</th>
                <th>
                  {isDebtors ? "Amount Owed (KES)" : "Amount Payable (KES)"}
                </th>
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
                const expanded = expandedRow === c.id;

                const status =
                  balance === 0 && paymentsData[c.id]?.length
                    ? "PAID"
                    : isOwed
                      ? "OWED"
                      : "OK";

                return (
                  <tr key={c.id}>
                    <td>
                      <button
                        className="icon-btn
"
                        onClick={() => toggleRow(c.id)}
                        title={expanded ? "Hide Payments" : "Show Payments"}
                      >
                        {expanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </td>
                    <td>{name || "-"}</td>
                    <td>{company ? company.replace(")", "") : "-"}</td>
                    <td className="balance-cell">KES {balance.toFixed(2)}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          status === "OWED"
                            ? "status-owed"
                            : status === "PAID"
                              ? "status-paid"
                              : "status-ok"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {/* <button className="iconBtn" title="Edit">
                      <Pencil size={16} />
                    </button> */}
                      <button className="icon-btn" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Expanded Payments Row */}
              {customers.map((c) => {
                const expanded = expandedRow === c.id;
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
                          <table
                            className={`nestedTable`}
                            style={{ marginTop: "0.5rem" }}
                          >
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
                                    <td>
                                      {new Date(p.created_at).toLocaleString()}
                                    </td>
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
                            style={{
                              marginTop: "0.5rem",
                              display: "flex",
                              gap: "0.5rem",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Amount"
                              value={paymentForm[c.id]?.amount || ""}
                              onChange={(e) =>
                                handlePaymentInput(
                                  c.id,
                                  "amount",
                                  e.target.value,
                                )
                              }
                            />
                            <select
                              value={paymentForm[c.id]?.payment_method || ""}
                              onChange={(e) =>
                                handlePaymentInput(
                                  c.id,
                                  "payment_method",
                                  e.target.value,
                                )
                              }
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
                              onChange={(e) =>
                                handlePaymentInput(
                                  c.id,
                                  "notes",
                                  e.target.value,
                                )
                              }
                            />
                            <button onClick={() => submitPayment(c.id)}>
                              Add Payment
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="hidden-desktop flex flex-col gap-md">
        {customers.map((c) => {
          const balance = Number(c.balance || 0);
          const isOwed = isDebtors && balance > 0;
          const expanded = expandedRow === c.id;

          const status =
            balance === 0 && paymentsData[c.id]?.length
              ? "PAID"
              : isOwed
                ? "OWED"
                : "OK";

          return (
            <div key={c.id} className="card flex flex-col gap-sm">
              <div className="flex justify-between items-center">
                <span className="text-bold">{c.full_name}</span>
                <span
                  className={`status-pill ${
                    status === "OWED"
                      ? "status-owed"
                      : status === "PAID"
                        ? "status-paid"
                        : "status-ok"
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="text-sm">
                <strong>Balance:</strong> KES {balance.toFixed(2)}
              </div>

              <div className="flex gap-sm mt-sm">
                <button
                  className="btn btn-secondary"
                  onClick={() => toggleRow(c.id)}
                >
                  {expanded ? "Hide Payments" : "View Payments"}
                </button>

                <button className="btn btn-danger">Delete</button>
              </div>

              {/* Expanded payments (mobile) */}
              {expanded && (
                <div className="flex flex-col gap-sm mt-sm">
                  {loadingPayments[c.id] ? (
                    <p>Loading payments…</p>
                  ) : (paymentsData[c.id] || []).length === 0 ? (
                    <p className="text-muted">No payments yet</p>
                  ) : (
                    paymentsData[c.id].map((p) => (
                      <div key={p.id} className="card p-sm">
                        <div className="text-sm">
                          <strong>Date:</strong>{" "}
                          {new Date(p.created_at).toLocaleString()}
                        </div>
                        <div className="text-sm">
                          <strong>Amount:</strong> KES {p.amount.toFixed(2)}
                        </div>
                        <div className="text-sm">
                          <strong>Method:</strong> {p.payment_method}
                        </div>
                        <div className="text-sm">
                          <strong>Notes:</strong> {p.notes || "-"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
