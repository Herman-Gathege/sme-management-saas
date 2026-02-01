// frontend/src/features/suppliers/OwnerPayments.jsx
import { useEffect, useState } from "react";
import { listSuppliers, listPayments, createPayment } from "../../api/suppliers";
import "./SupplierModule.css";

export default function OwnerSupplierPayments({ userId }) {
  const [suppliers, setSuppliers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    supplier_id: "",
    amount: "",
    payment_method: "cash",
    notes: ""
  });

  // ---------------- Fetch Suppliers & Payments ----------------
  const fetchData = async () => {
    try {
      const supplierData = await listSuppliers();
      const paymentData = await listPayments();
      setSuppliers(supplierData);
      setPayments(paymentData);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- Add New Payment ----------------
  const handleAddPayment = async () => {
    if (!newPayment.supplier_id) {
      return alert("Please select a supplier");
    }

    const amountNum = parseFloat(newPayment.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return alert("Enter a valid amount");
    }

    const payload = {
      supplier_id: Number(newPayment.supplier_id),
      amount: amountNum,
      payment_method: newPayment.payment_method,
      notes: newPayment.notes
    };

    console.log("Submitting payment payload:", payload);

    try {
      await createPayment(payload);

      // Reset form
      setNewPayment({
        supplier_id: "",
        amount: "",
        payment_method: "cash",
        notes: ""
      });

      fetchData();
    } catch (err) {
      console.error("Error creating payment:", err);
      alert("Failed to create payment");
    }
  };

  return (
    <div className="content">
      <h2>Supplier Payments</h2>

      {/* ---------- New Payment Form ---------- */}
      <form
        className="payment-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddPayment();
        }}
      >
        <select
          required
          value={newPayment.supplier_id}
          onChange={(e) =>
            setNewPayment({ ...newPayment, supplier_id: e.target.value })
          }
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              #{s.id} – {s.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          required
          placeholder="Amount"
          value={newPayment.amount}
          onChange={(e) =>
            setNewPayment({ ...newPayment, amount: e.target.value })
          }
        />

        <select
          required
          value={newPayment.payment_method}
          onChange={(e) =>
            setNewPayment({ ...newPayment, payment_method: e.target.value })
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
            setNewPayment({ ...newPayment, notes: e.target.value })
          }
        />

        <button type="submit">Add Payment</button>
      </form>

      {/* ---------- Payments Table ---------- */}
      <h3>All Payments</h3>
      <table className="payments-table">
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
          {payments.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No payments found
              </td>
            </tr>
          ) : (
            payments.map((p) => (
              <tr key={p.id}>
                <td>{p.supplier_name || `#${p.supplier_id}`}</td>
                <td>{p.amount}</td>
                <td>{p.payment_method}</td>
                <td>{p.notes}</td>
                <td>{new Date(p.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
