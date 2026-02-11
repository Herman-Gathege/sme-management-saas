//frontend/src/features/stock/AddStock.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/client";

export default function AddStock() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: "",
    unit_price: "",
    selling_price: "",
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

      const res = await apiFetch("/api/stock", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          unit_price: Number(form.unit_price),
          selling_price: Number(form.selling_price || 0),
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
    <section className="card">
      <h3>Add Stock Item</h3>

      <form onSubmit={handleSubmit} className="form-stack">
        <input
        className="input"
          name="name"
          placeholder="Item name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
        className="input"
          name="sku"
          placeholder="SKU (optional)"
          value={form.sku}
          onChange={handleChange}
        />

        <input
        className="input"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <input
        className="input"
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <input
        className="input"
          type="number"
          step="0.01"
          name="unit_price"
          placeholder="Unit price"
          value={form.unit_price}
          onChange={handleChange}
          required
        />
          <input
          className="input"
          type="number"
          step="0.01"
          name="selling_price"
          placeholder="Selling price (optional)"
          value={form.selling_price}
          onChange={handleChange}
        />

        <input
        className="input"
          type="number"
          name="min_stock_level"
          placeholder="Minimum stock level"
          value={form.min_stock_level}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Saving..." : "Add Stock"}
        </button>

        {error && <p className="text-error">{error}</p>}
      </form>
    </section>
  );
}
