//frontend/src/features/customers/AllCustomers.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listCustomers } from "../../api/customers";
import { useNavigate } from "react-router-dom";

export default function AllCustomers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const data = await listCustomers();
      setCustomers(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCustomers();
}, []);


  return (
    <section className="dashboard-content">
      <div className="card">
        <div className="customers-header">
          <h3 className="text-lg text-bold">All Customers</h3>
        </div>

        {loading && <p>Loading customers…</p>}
        {message && <p className="text-error">{message}</p>}

        {!loading && customers.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="table-wrapper hidden-mobile">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Business</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, idx) => (
                    <tr key={c.id}>
                      <td>{idx + 1}</td>
                      <td>{c.name}</td>
                      <td>{c.business_name || "—"}</td>
                      <td>{c.email || "—"}</td>
                      <td>{c.phone || "—"}</td>
                      <td>{c.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="hidden-desktop flex flex-col gap-md">
              {customers.map((c, idx) => (
                <div key={c.id} className="card flex flex-col gap-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-bold">{c.name}</span>
                    <span className="text-sm text-muted">#{idx + 1}</span>
                  </div>

                  <div className="text-sm">
                    <strong>Business:</strong> {c.business_name || "—"}
                  </div>

                  <div className="text-sm">
                    <strong>Email:</strong> {c.email || "—"}
                  </div>

                  <div className="text-sm">
                    <strong>Phone:</strong> {c.phone || "—"}
                  </div>

                  <div className="text-sm">
                    <strong>Role:</strong> {c.role}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
