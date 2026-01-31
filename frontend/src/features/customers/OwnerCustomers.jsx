// frontend/src/features/customers/OwnerCustomers.jsx

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import styles from "./Customers.module.css";

export default function OwnerCustomers() {
  const location = useLocation();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Determine which list to load from URL
  const isDebtors = location.pathname.includes("debtors");
  const roleEndpoint = isDebtors ? "debtors" : "creditors";

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${API_BASE}/api/customers/${roleEndpoint}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {isDebtors ? "Debtors" : "Creditors"}
        </h2>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && customers.length === 0 && (
        <p>No {isDebtors ? "debtors" : "creditors"} found.</p>
      )}

      {!loading && customers.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
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

              // Split full_name safely
              const [name, company] = c.full_name?.includes("(")
                ? c.full_name.split(" (")
                : [c.full_name, "-"];

              return (
                <tr key={c.id}>
                  <td>{name || "-"}</td>
                  <td>{company ? company.replace(")", "") : "-"}</td>

                  <td className={styles.balance}>
                    KES {balance.toFixed(2)}
                  </td>

                  <td>
                    <span
                      className={
                        isOwed ? styles.statusOwed : styles.statusOk
                      }
                    >
                      {isOwed ? "OWED" : "OK"}
                    </span>
                  </td>

                  <td className={styles.actions}>
                    <button className={styles.iconBtn} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button className={styles.iconBtn} title="Delete">
                      <Trash2 size={16} />
                    </button>
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
