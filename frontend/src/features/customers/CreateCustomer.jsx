// frontend/src/features/customers/CreateCustomer.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../sales/Sales.module.css";

export default function CreateCustomer() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("debtor");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          business_name: businessName,
          phone,
          email,
          role,
          notes,
          organization_id: user.organization_id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create customer");

      setMessage("Customer created successfully!");
      setName("");
      setBusinessName("");
      setPhone("");
      setEmail("");
      setRole("debtor");
      setNotes("");

      navigate("/owner/customers");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles["sales-card"]}>
      <h2>Create Customer</h2>
      {message && <p className={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} className={styles["customer-form"]}>
        {/* Row 1: Name & Business Name */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Business Name:</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: Phone & Email */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Row 3: Role */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="debtor">Debtor</option>
              <option value="creditor">Creditor</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        {/* Row 4: Notes */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Notes:</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Customer"}
        </button>
      </form>
    </section>
  );
}
