//frontend/src/features/stock/AddStock.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../dashboard/layout/DashboardLayout.module.css";

export default function AddStock() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: "",
    unit_price: "",
    min_stock_level: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:5000/api/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          unit_price: Number(form.unit_price),
          min_stock_level: Number(form.min_stock_level || 0),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add stock");

      navigate("/owner/stock");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.card}>
      <h3>Add Stock Item</h3>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          placeholder="Item name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="sku"
          placeholder="SKU (optional)"
          value={form.sku}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          step="0.01"
          name="unit_price"
          placeholder="Unit price"
          value={form.unit_price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="min_stock_level"
          placeholder="Minimum stock level"
          value={form.min_stock_level}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Stock"}
        </button>

        {error && <p className={styles.message}>{error}</p>}
      </form>
    </section>
  );
}
