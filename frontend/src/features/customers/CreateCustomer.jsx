// frontend/src/features/customers/CreateCustomer.jsx

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
// import styles from "../sales/Sales.module.css";

export default function CreateCustomer({ onSuccess, onClose }) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    business_name: "",
    phone: "",
    email: "",
    role: "debtor",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
          ...form,
          organization_id: user.organization_id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // ✅ return created customer
      onSuccess?.(data);

      // reset
      setForm({
        name: "",
        business_name: "",
        phone: "",
        email: "",
        role: "debtor",
        notes: "",
      });

      onClose?.();

    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card form-stack">
      <h3 className="text-md text-bold">Add Customer</h3>
      {message && <p>{message}</p>}

      <input
        className="input"
        placeholder="Name"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        required
      />

      <input
        className="input"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
      />

      <input
        className="input"
        placeholder="Email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />

      <input
        className="input"
        placeholder="Business Name"
        value={form.business_name}
        onChange={(e) => handleChange("business_name", e.target.value)}
      />

      <textarea
        className="input" rows="3"
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
      />

      <button 
      className="btn btn-primary"
      disabled={loading}>
        {loading ? "Saving..." : "Save Customer"}
      </button>
    </form>
  );
}
