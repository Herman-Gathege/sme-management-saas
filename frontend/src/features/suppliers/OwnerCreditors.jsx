// frontend/src/features/suppliers/OwnerCreditors.jsx
import { useEffect, useState } from "react";
import "./SupplierModule.css";

export default function OwnerCreditors() {
  const [creditors, setCreditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCreditors = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/suppliers/creditors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch creditors");
        setCreditors(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditors();
  }, [API_BASE, token]);

  return (
    <div className="ownercreditors-container">
      <h2>Supplier Creditors</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="ownercreditors-error">{error}</p>}
      {!loading && creditors.length === 0 && <p>No creditors found.</p>}

      {!loading && creditors.length > 0 && (
        <table className="ownercreditors-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Total Credit (KES)</th>
              <th>Total Paid (KES)</th>
              <th>Balance Due (KES)</th>
            </tr>
          </thead>
          <tbody>
            {creditors.map((c) => (
              <tr key={c.supplier_id}>
                <td>{c.supplier_name}</td>
                <td>{c.total_credit.toFixed(2)}</td>
                <td>{c.total_paid.toFixed(2)}</td>
                <td>{c.balance_due.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
