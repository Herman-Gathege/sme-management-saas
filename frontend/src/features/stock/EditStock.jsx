//frontend/src/features/stock/EditStock.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../dashboard/layout/DashboardLayout.module.css";

export default function EditStock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: "",
    unit_price: "",
    min_stock_level: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchStockItem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/stock/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load stock");

        const item = await res.json();

        setForm({
          name: item.name,
          sku: item.sku || "",
          category: item.category || "",
          quantity: item.quantity,
          unit_price: item.unit_price,
          min_stock_level: item.min_stock_level,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockItem();
  }, [id, API_BASE]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/stock/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          unit_price: Number(form.unit_price),
          min_stock_level: Number(form.min_stock_level),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update stock");

      navigate("/owner/stock");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading stock item...</p>;
  if (error) return <p className={styles.message}>{error}</p>;

  return (
    <section className={styles.card}>
      <h3>Edit Stock Item</h3>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Name */}
        <label htmlFor="name">Item Name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* SKU */}
        <label htmlFor="sku">SKU</label>
        <input id="sku" name="sku" value={form.sku} onChange={handleChange} />

        {/* Category */}
        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
        />

        {/* Quantity */}
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        {/* Unit Price */}
        <label htmlFor="unit_price">Unit Price</label>
        <input
          id="unit_price"
          type="number"
          step="0.01"
          name="unit_price"
          value={form.unit_price}
          onChange={handleChange}
          required
        />

        {/* Minimum Stock Level */}
        <label htmlFor="min_stock_level">Minimum Stock Level</label>
        <input
          id="min_stock_level"
          type="number"
          name="min_stock_level"
          value={form.min_stock_level}
          onChange={handleChange}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Stock"}
        </button>
      </form>
    </section>
  );
}
