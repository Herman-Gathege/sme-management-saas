// frontend/src/features/suppliers/OwnerCreditors.jsx
// import { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import { listPayments, createPayment } from "../../api/suppliers";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FiInfo } from "react-icons/fi";

// import "./SupplierModule.css";

export default function OwnerCreditors() {
  const [creditors, setCreditors] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expandedSupplierId, setExpandedSupplierId] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [showPaymentFormFor, setShowPaymentFormFor] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // adjust per page
  // Filter by supplier name
  const filteredCreditors = creditors.filter((c) =>
    c.supplier_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Recalculate pages based on filtered results
  const totalPages = Math.ceil(filteredCreditors.length / itemsPerPage);

  // Paginate filtered results
  const paginatedCreditors = filteredCreditors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



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
      setLoading(false),
    );
  }, []);

  

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

    // Show success feedback
    setSuccessMessage("Payment saved successfully");

    // Reset form
    setNewPayment({
      supplier_id: "",
      amount: "",
      payment_method: "cash",
      notes: "",
    });

    setShowPaymentFormFor(null);

    // Refresh payments immediately
    await fetchPayments();

    // Delay creditors refresh so user sees confirmation
    setTimeout(async () => {
      await fetchCreditors();

      // Clear expanded state if supplier no longer exists in creditors
      setExpandedSupplierId(null);

    }, 800);

    // Clear success message
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

  } catch (err) {
    alert("Failed to add payment");
  }
};


  const toggleExpand = (supplierId) => {
    setExpandedSupplierId(
      expandedSupplierId === supplierId ? null : supplierId,
    );
    setExpanded((prev) => ({
      ...prev,
      [supplierId]: !prev[supplierId],
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <section className="card flex flex-col gap-lg">
      <h2>Suppliers you Owe Money</h2>
      <div className="flex flex-mobile-col gap-sm mb-md">
        <input
          className="input"
          placeholder="Search supplier..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
        />
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setSearchTerm("");
            setCurrentPage(1);
          }}
        >
          Clear Search
        </button>
      </div>

      <p className="hint flex items-center gap-sm">
              <FiInfo />
              Any amount with a negative (-) before the number indicates an
              overpayment during debt settlement.
              <br /> This amount will be used to settle future debts.
      </p>

      {successMessage && (
        <div className="success-banner">
          {successMessage}
        </div>
      )}


      <div className="customers-table-wrapper stock-table-wrapper hidden-on-mobile">
        <table className="customers-table">

        <thead>
          <tr>
            <th></th>
            <th>Supplier</th>
            <th>Total Credit (KES)</th>
            <th>Total Paid (KES)</th>
            <th>Balance Due (KES)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCreditors.map((c) => {
            const supplierPayments = payments.filter(
              (p) => p.supplier_id === c.supplier_id,
            );

            return (
              <React.Fragment key={c.supplier_id}>
                <tr key={c.supplier_id}>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => toggleExpand(c.supplier_id)}
                    >
                      {expanded[c.supplier_id] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </td>

                  <td>{c.supplier_name}</td>
                  <td>{c.total_credit.toFixed(2)}</td>
                  <td>{c.total_paid.toFixed(2)}</td>
                  <td>{c.balance_due.toFixed(2)}</td>
                  <td>
                    {c.balance_due > 0
                      ? "Owing"
                      : c.balance_due < 0
                      ? "Overpaid"
                      : "Settled"}
                  </td>
                </tr>

                {expandedSupplierId === c.supplier_id && (
                  <tr>
                    <td colSpan="5">
                      <div className="card subtle mt-sm">
                        <h4 className="mb-sm">Payments</h4>

                        <table className="nested-table mb-sm">
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
                                    {new Date(p.created_at).toLocaleString()}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>

                        {showPaymentFormFor === c.supplier_id ? (
                          <form
                            className="flex gap-sm flex-wrap mt-sm"
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAddPayment(c.supplier_id);
                            }}
                          >
                            <input
                            className="input"
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
                            className="input"
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
                            className="input"
                              placeholder="Notes"
                              value={newPayment.notes}
                              onChange={(e) =>
                                setNewPayment({
                                  ...newPayment,
                                  notes: e.target.value,
                                })
                              }
                            />

                            <button className="btn btn-primary btn-sm" type="submit">Save Payment</button>
                          </form>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowPaymentFormFor(c.supplier_id)}
                          >
                            + Add Payment
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <div className="pagination flex gap-sm mt-md justify-center ">
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


      {/* Mobile cards with expandable items */}
      <div className="stock-cards hidden-desktop">
        {paginatedCreditors.map((c) => {
          const supplierPayments = payments.filter(
            (p) => p.supplier_id === c.supplier_id,
          );

          return (
            <div key={c.supplier_id} className="card flex flex-col gap-sm">
              <div className="flex justify-between items-center">
                <strong className="text-md">{c.supplier_name}</strong>
                <button
                  className="icon-btn"
                  onClick={() => toggleExpand(c.supplier_id)}
                >
                  {expanded[c.supplier_id] ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              </div>

              <div className="text-sm">
                <span className="text-muted">Total Credit:</span>{" "}
                {c.total_credit.toFixed(2)}
              </div>
              <div className="text-sm">
                <span className="text-muted">Total Paid:</span>{" "}
                {c.total_paid.toFixed(2)}
              </div>
              <div className="text-sm">
                <span className="text-muted">Balance:</span>{" "}
                <strong>{c.balance_due.toFixed(2)}</strong>
              </div>
              <div className="text-sm">
                <span className="text-muted">Status:</span>{" "}
                {c.balance_due > 0
                  ? "Owing"
                  : c.balance_due < 0
                  ? "Overpaid"
                  : "Settled"}
              </div>

              {expandedSupplierId === c.supplier_id && (
                <div className="mt-sm flex flex-col gap-sm">
                  <strong>Payments</strong>

                  {supplierPayments.length === 0 ? (
                    <div className="muted-text">No payments found</div>
                  ) : (
                    supplierPayments.map((p) => (
                      <div key={p.id} className="card subtle">
                        <div>Amount: {p.amount}</div>
                        <div>Method: {p.payment_method}</div>
                        <div>{p.notes}</div>
                        <div className="muted-text">
                          {new Date(p.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}

                  {showPaymentFormFor === c.supplier_id ? (
                    <form
                      className="flex flex-col gap-sm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddPayment(c.supplier_id);
                      }}
                    >
                      <input
                        className="input"
                        type="number"
                        placeholder="Amount"
                        value={newPayment.amount}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            amount: e.target.value,
                          })
                        }
                      />

                      <select
                        className="input"
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
                        className="input"
                        placeholder="Notes"
                        value={newPayment.notes}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            notes: e.target.value,
                          })
                        }
                      />

                      <button className="btn btn-primary btn-sm">
                        Save Payment
                      </button>
                    </form>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowPaymentFormFor(c.supplier_id)}
                    >
                      + Add Payment
                    </button>
                  )}
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

      

    </section>
  );
}
