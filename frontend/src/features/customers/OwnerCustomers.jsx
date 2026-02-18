// frontend/src/features/customers/OwnerCustomers.jsx
// import { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { FiInfo } from "react-icons/fi";
import {
  listCustomers,
  getCustomerPayments,
  recordCustomerPayment,
} from "../../api/customers";


export default function OwnerCustomers() {
  const location = useLocation();

  const isDebtors = location.pathname.includes("debtors");
  const isAll = location.pathname.includes("all");
  const roleEndpoint = isAll ? "" : isDebtors ? "debtors" : "creditors";
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedRow, setExpandedRow] = useState(null);
  const [paymentsData, setPaymentsData] = useState({});
  const [loadingPayments, setLoadingPayments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [paymentForm, setPaymentForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // adjust to your preference
  // Helper to compute status

  

  const getStatus = (c) => {
    const balance = Number(c.balance || 0);
    const isOwed = isDebtors && balance > 0;

    const payments = paymentsData[c.id] || [];

    if (balance === 0 && payments.length) return "paid";
    if (isOwed) return "owes";
    return "ok";
  };

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const balance = Number(c.balance || 0);

    return (
      c.full_name?.toLowerCase().includes(term) ||
      balance.toString().includes(term) ||
      getStatus(c).includes(term)
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );




  // const API_BASE = import.meta.env.VITE_API_URL;
  // const token = localStorage.getItem("token");

 

  /* ================= FETCH CUSTOMERS ================= */
  useEffect(() => {
  const fetchCustomers = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await listCustomers(roleEndpoint);
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCustomers();
}, [roleEndpoint]);


  /* ================= ROW TOGGLE ================= */
  const toggleRow = (customerId) => {
    setExpandedRow((prev) => (prev === customerId ? null : customerId));

    if (expandedRow !== customerId) {
      fetchPayments(customerId);
    }
  };

  /* ================= FETCH PAYMENTS ================= */
  const fetchPayments = async (customerId) => {
  setLoadingPayments((prev) => ({ ...prev, [customerId]: true }));

  try {
    const data = await getCustomerPayments(customerId);

    setPaymentsData((prev) => ({
      ...prev,
      [customerId]: data,
    }));
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingPayments((prev) => ({
      ...prev,
      [customerId]: false,
    }));
  }
};


  /* ================= PAYMENT FORM ================= */
  const handlePaymentInput = (customerId, field, value) => {
    setPaymentForm((prev) => ({
      ...prev,
      [customerId]: { ...prev[customerId], [field]: value },
    }));
  };

  const submitPayment = async (customerId) => {
  const form = paymentForm[customerId] || {};

  if (!form.amount || parseFloat(form.amount) <= 0)
    return alert("Amount must be positive");

  if (!form.payment_method)
    return alert("Select a payment method");

  try {
    await recordCustomerPayment({
      customer_id: customerId,
      amount: parseFloat(form.amount),
      payment_method: form.payment_method,
      notes: form.notes || "",
    });

    await fetchPayments(customerId);

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              balance:
                (c.balance || 0) - parseFloat(form.amount),
            }
          : c
      )
    );

    setPaymentForm((prev) => ({
      ...prev,
      [customerId]: {},
    }));
  } catch (err) {
    alert(err.message);
  }
};


  /* ================= RENDER ================= */
  return (
    <div className="customers-container bg-white p-lg rounded-lg shadow-sm">
      <div className="customers-header">
        <h2 className="text-lg text-bold">
          {isDebtors ? "Debtors" : "Creditors"}
        </h2>
      </div>

       <div className="flex flex-mobile-col gap-sm">
        <input
          className="input"
          placeholder="Search name, balance or status..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <button
          className="btn btn-secondary"
          onClick={() => {
            setSearchTerm("");
            setCurrentPage(1);
          }}
        >
          Clear
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-error">{error}</p>}

      {!loading && filteredCustomers.length === 0 && (

        <p>No {isDebtors ? "debtors" : "creditors"} found.</p>
      )}

      <p className="hint flex items-center gap-sm">
        <FiInfo />
        Any amount with a negative (-) before the number indicates an
        overpayment during debt settlement.
        <br /> This amount will be used to settle future debts.
      </p>

      {/* DESKTOP TABLE */}
      {!loading && filteredCustomers.length > 0 && (

        <div className="customers-table-wrapper hidden-mobile ">
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
              {paginatedCustomers.map((c) => {
                const balance = Number(c.balance || 0);
                const isOwed = isDebtors && balance > 0;
                const expanded = expandedRow === c.id;

                const payments = paymentsData[c.id] || [];
                const loadingPay = loadingPayments[c.id];

                const status =
                  balance === 0 && payments.length
                    ? "PAID"
                    : isOwed
                      ? "OWES"
                      : "OK";

                const [name, company] = c.full_name?.includes("(")
                  ? c.full_name.split(" (")
                  : [c.full_name, "-"];

                return (
                  <React.Fragment key={c.id}>
                    {/* MAIN ROW */}
                    <tr key={c.id}>
                      <td>
                        <button
                          className="icon-btn"
                          onClick={() => toggleRow(c.id)}
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
                      <td>KES {balance.toFixed(2)}</td>

                      <td>
                        <span
                          className={`status-pill ${
                            status === "OWES"
                              ? "status-owed"
                              : status === "PAID"
                                ? "status-paid"
                                : "status-ok"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <button className="icon-btn">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED ROW */}
                    {expanded && (
                      <tr key={`payments-${c.id}`}>
                        <td colSpan={6}>
                          {loadingPay ? (
                            <p>Loading payments...</p>
                          ) : (
                            <>
                              <table className="nested-table">
                                <thead>
                                  <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
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
                                          {new Date(
                                            p.created_at,
                                          ).toLocaleString()}
                                        </td>
                                        <td>KES {p.amount.toFixed(2)}</td>
                                        <td>{p.payment_method}</td>
                                        <td>{p.notes || "-"}</td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>

                              <div className="paymentForm ">
                                <input
                                  className="mr-sm"
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
                                  className="mr-sm"
                                  value={
                                    paymentForm[c.id]?.payment_method || ""
                                  }
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
                                  className="mr-sm"
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
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <div className="pagination flex gap-sm mt-md justify-center">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {/* {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))} */}

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

        </div>
      )}

      {/* MOBILE CARDS */}
      <div className="hidden-desktop flex flex-col gap-md">
        {paginatedCustomers.map((c) => {
          const balance = Number(c.balance || 0);
          const isOwed = isDebtors && balance > 0;
          const expanded = expandedRow === c.id;

          const status =
            balance === 0 && paymentsData[c.id]?.length
              ? "PAID"
              : isOwed
                ? "OWES"
                : "OK";

          return (
            <div key={c.id} className="card flex flex-col gap-sm">
              <div className="flex justify-between items-center">
                <span className="text-bold">{c.full_name}</span>
                <span
                  className={`status-pill ${
                    status === "OWES"
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

                  {/* ✅ MOBILE PAYMENT FORM */}
                  <div className="paymentForm form-stack mt-sm">
                    <input
                      className="input"
                      type="number"
                      placeholder="Amount"
                      value={paymentForm[c.id]?.amount || ""}
                      onChange={(e) =>
                        handlePaymentInput(c.id, "amount", e.target.value)
                      }
                    />

                    <select
                      className="input"
                      value={paymentForm[c.id]?.payment_method || ""}
                      onChange={(e) =>
                        handlePaymentInput(
                          c.id,
                          "payment_method",
                          e.target.value,
                        )
                      }
                    >
                      <option value="">Select Method</option>
                      <option value="cash">Cash</option>
                      <option value="mpesa">MPESA</option>
                      <option value="bank">Bank</option>
                    </select>

                    <input
                      className="input"
                      type="text"
                      placeholder="Notes"
                      value={paymentForm[c.id]?.notes || ""}
                      onChange={(e) =>
                        handlePaymentInput(c.id, "notes", e.target.value)
                      }
                    />

                    <button
                      className="btn btn-primary"
                      onClick={() => submitPayment(c.id)}
                    >
                      Add Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="pagination flex gap-sm mt-md justify-center hidden-desktop">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {/* {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))} */}

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
