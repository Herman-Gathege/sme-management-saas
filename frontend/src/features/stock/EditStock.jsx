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

  useEffect(() => {
    const fetchStockItem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:5000/api/stock/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to load stock");

        const item = data.find((s) => s.id === Number(id));
        if (!item) throw new Error("Stock item not found");

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
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/api/stock/${id}`, {
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

      navigate("/stock");
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
        <input
          name="name"
          placeholder="Item name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="sku"
          placeholder="SKU"
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

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Stock"}
        </button>
      </form>
    </section>
  );
}
