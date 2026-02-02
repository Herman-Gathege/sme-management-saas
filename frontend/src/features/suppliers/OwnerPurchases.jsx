// frontend/src/features/suppliers/OwnerPurchases.jsx
import React, { useEffect, useState } from "react";
import {
  listSuppliers,
  listPurchases,
  createPurchase
} from "../../api/suppliers";
import "./SupplierModule.css";

export default function OwnerSupplierPurchases() {
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [expanded, setExpanded] = useState({});

  const [newPurchase, setNewPurchase] = useState({
    supplier_id: "",
    payment_method: "credit",
    notes: "",
    items: [
      { name: "", quantity: 1, unit_price: 0, sku: "", category: "", min_stock_level: 0 }
    ]
  });

  // ---------------- Fetch Data ----------------
  const fetchData = async () => {
    try {
      const [suppliersData, purchasesData] = await Promise.all([
        listSuppliers(),
        listPurchases()
      ]);
      setSuppliers(suppliersData);
      setPurchases(purchasesData);
    } catch (err) {
      console.error(err);
      alert("Error fetching data: " + (err.message || err));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- Items Logic ----------------
  const addItem = () => {
    setNewPurchase(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", quantity: 1, unit_price: 0, sku: "", category: "", min_stock_level: 0 }
      ]
    }));
  };

  const removeItem = index => {
    setNewPurchase(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setNewPurchase(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAddPurchase = async () => {
    if (!newPurchase.supplier_id) return alert("Please select a supplier");
    if (!newPurchase.items.length) return alert("Add at least one item");

    // Prepare and sanitize items
    const cleanedItems = newPurchase.items.map(item => ({
      name: (item.name || "").trim(),
      quantity: Number(item.quantity) || 0,
      unit_price: Number(item.unit_price) || 0,
      sku: item.sku?.trim() || null,
      category: item.category?.trim() || null,
      min_stock_level: Number(item.min_stock_level) || 0
    }));

    // Validate
    for (const i of cleanedItems) {
      if (!i.name || i.quantity <= 0 || i.unit_price <= 0) {
        return alert(
          "Each item must have a valid name, quantity, and unit price greater than 0"
        );
      }
    }

    const payload = {
      supplier_id: Number(newPurchase.supplier_id),
      payment_method: newPurchase.payment_method,
      notes: (newPurchase.notes || "").trim(),
      items: cleanedItems
    };

    console.log("Submitting purchase:", payload);

    try {
      await createPurchase(payload);
      setNewPurchase({
        supplier_id: "",
        payment_method: "credit",
        notes: "",
        items: [
          { name: "", quantity: 1, unit_price: 0, sku: "", category: "", min_stock_level: 0 }
        ]
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to create purchase: " + (err.message || err));
    }
  };

  // ---------------- UI Helpers ----------------
  const toggleExpand = purchaseId => {
    setExpanded(prev => ({
      ...prev,
      [purchaseId]: !prev[purchaseId]
    }));
  };

  const purchaseTotal = newPurchase.items.reduce(
    (sum, i) =>
      sum +
      (Number(i.quantity) || 0) * (Number(i.unit_price) || 0),
    0
  );

  // ---------------- Render ----------------
  return (
    <div className="content">
      <h2>Supplier Purchases</h2>

      {/* ---------- New Purchase ---------- */}
      <div className="purchase-form">
        <div className="purchase-controls">
          <select
            value={newPurchase.supplier_id}
            onChange={e =>
              setNewPurchase({ ...newPurchase, supplier_id: e.target.value })
            }
          >
            <option value="">Select Supplier</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={newPurchase.payment_method}
            onChange={e =>
              setNewPurchase({ ...newPurchase, payment_method: e.target.value })
            }
          >
            <option value="credit">Credit</option>
            <option value="cash">Cash</option>
            <option value="mpesa">Mpesa</option>
            <option value="bank">Bank</option>
          </select>

          <button className="btn-small" onClick={addItem}>
            + Add Item
          </button>
        </div>

        {newPurchase.items.length > 0 && (
          <table className="items-form-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Min Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {newPurchase.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.name}
                      placeholder="Item Name"
                      onChange={e => updateItem(index, "name", e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateItem(index, "quantity", Math.max(1, Number(e.target.value)))}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={e => updateItem(index, "unit_price", Math.max(0, parseFloat(e.target.value) || 0))}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.sku}
                      placeholder="SKU"
                      onChange={e => updateItem(index, "sku", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.category}
                      placeholder="Category"
                      onChange={e => updateItem(index, "category", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={item.min_stock_level}
                      onChange={e => updateItem(index, "min_stock_level", Math.max(0, Number(e.target.value) || 0))}
                    />
                  </td>
                  <td>
                    <button className="btn-small remove-btn" onClick={() => removeItem(index)}>
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: "8px", fontWeight: "bold" }}>
          Total: {purchaseTotal.toFixed(2)}
        </div>

        <button className="btn-primary" onClick={handleAddPurchase}>
          Create Purchase
        </button>
      </div>

      {/* ---------- Purchases List ---------- */}
      <h3>All Purchases</h3>
      <table className="payments-table">
        <thead>
          <tr>
            <th></th>
            <th>Supplier</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Items</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {purchases.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No purchases found
              </td>
            </tr>
          ) : (
            purchases.map(p => {
              const supplier =
                suppliers.find(s => s.id === p.purchase.supplier_id)?.name ||
                "N/A";

              return (
                <React.Fragment key={p.purchase.id}>
                  <tr>
                    <td onClick={() => toggleExpand(p.purchase.id)}>
                      {expanded[p.purchase.id] ? "▼" : "▶"}
                    </td>
                    <td>{supplier}</td>
                    <td>{p.purchase.total_amount.toFixed(2)}</td>
                    <td>{p.purchase.payment_method}</td>
                    <td>{p.items.length}</td>
                    <td>{new Date(p.purchase.created_at).toLocaleString()}</td>
                  </tr>

                  {expanded[p.purchase.id] && (
                    <tr>
                      <td colSpan="6">
                        <table className="items-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Qty</th>
                              <th>Unit Price</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {p.items.map((i, idx) => (
                              <tr key={idx}>
                                <td>{i.name}</td>
                                <td>{i.quantity}</td>
                                <td>{i.unit_price.toFixed(2)}</td>
                                <td>{(i.quantity * i.unit_price).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
