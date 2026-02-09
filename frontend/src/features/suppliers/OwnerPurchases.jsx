// frontend/src/features/suppliers/OwnerPurchases.jsx

import React, { useEffect, useState } from "react";
import {
  listSuppliers,
  listPurchases,
  createPurchase,
} from "../../api/suppliers";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function OwnerSupplierPurchases() {
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [newPurchase, setNewPurchase] = useState({
    supplier_id: "",
    payment_method: "credit",
    notes: "",
    items: [
      {
        name: "",
        quantity: 1,
        unit_price: 0,
        sku: "",
        category: "",
        min_stock_level: 0,
        selling_price: 0,
      },
    ],
  });

  // ---------------- Fetch Data ----------------
  const fetchData = async () => {
    try {
      const [suppliersData, purchasesData] = await Promise.all([
        listSuppliers(),
        listPurchases(),
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
    setNewPurchase((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: "",
          quantity: 1,
          unit_price: 0,
          sku: "",
          category: "",
          min_stock_level: 0,
          selling_price: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setNewPurchase((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index, field, value) => {
    setNewPurchase((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleAddPurchase = async () => {
    if (!newPurchase.supplier_id) return alert("Please select a supplier");
    if (!newPurchase.items.length) return alert("Add at least one item");

    const cleanedItems = newPurchase.items.map((item) => ({
      name: (item.name || "").trim(),
      quantity: Number(item.quantity) || 0,
      unit_price: Number(item.unit_price) || 0,
      sku: item.sku?.trim() || null,
      category: item.category?.trim() || null,
      min_stock_level: Number(item.min_stock_level) || 0,
      selling_price: Number(item.selling_price) || null,
    }));

    for (const i of cleanedItems) {
      if (!i.name || i.quantity <= 0 || i.unit_price <= 0) {
        return alert(
          "Each item must have a valid name, quantity, and unit price greater than 0",
        );
      }
    }

    const payload = {
      supplier_id: Number(newPurchase.supplier_id),
      payment_method: newPurchase.payment_method,
      notes: (newPurchase.notes || "").trim(),
      items: cleanedItems,
    };

    try {
      await createPurchase(payload);

      setNewPurchase({
        supplier_id: "",
        payment_method: "credit",
        notes: "",
        items: [
          {
            name: "",
            quantity: 1,
            unit_price: 0,
            sku: "",
            category: "",
            min_stock_level: 0,
            selling_price: 0,
          },
        ],
      });

      setShowModal(false); // ✅ close modal after success
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to create purchase: " + (err.message || err));
    }
  };

  // ---------------- UI Helpers ----------------
  const toggleExpand = (purchaseId) => {
    setExpanded((prev) => ({
      ...prev,
      [purchaseId]: !prev[purchaseId],
    }));
  };

  const purchaseTotal = newPurchase.items.reduce(
    (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unit_price) || 0),
    0,
  );

  // ---------------- Render ----------------
  return (
    <section className="card flex flex-col gap-lg">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-center mb-md">
        <h2>Purchases</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add New Purchase
        </button>
      </div>

      {/* ---------- Modal (form moved here, unchanged) ---------- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>New Purchase</h3>

            <div className="purchase-form">
              <div className="flex gap-md flex-wrap mb-md">
                <select
                  className="input"
                  value={newPurchase.supplier_id}
                  onChange={(e) =>
                    setNewPurchase({
                      ...newPurchase,
                      supplier_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <select
                className="input"
                  value={newPurchase.payment_method}
                  onChange={(e) =>
                    setNewPurchase({
                      ...newPurchase,
                      payment_method: e.target.value,
                    })
                  }
                >
                  <option value="credit">Credit</option>
                  <option value="cash">Cash</option>
                  <option value="mpesa">Mpesa</option>
                  <option value="bank">Bank</option>
                </select>

                <button className="btn btn-secondary btn-sm" onClick={addItem}>
                  + Add Item
                </button>
              </div>

              {newPurchase.items.length > 0 && (
  <div className="cart-table-wrapper">
    <table className="staff-table">

                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Min Stock</th>
                      <th>Selling Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {newPurchase.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            className="input"
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              updateItem(index, "name", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="input"
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "quantity",
                                Math.max(1, Number(e.target.value)),
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="input"
                            type="number"
                            value={item.unit_price}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "unit_price",
                                Math.max(0, parseFloat(e.target.value) || 0),
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="input"
                            type="text"
                            value={item.sku}
                            onChange={(e) =>
                              updateItem(index, "sku", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="input"
                            type="text"
                            value={item.category}
                            onChange={(e) =>
                              updateItem(index, "category", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="input"
                            type="number"
                            value={item.min_stock_level}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "min_stock_level",
                                Math.max(0, Number(e.target.value) || 0),
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            className="input"
                            type="number"
                            value={item.selling_price}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "selling_price",
                                Math.max(0, parseFloat(e.target.value) || 0),
                              )
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => removeItem(index)}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}

              <div className="mt-sm">
                <strong>Total: {purchaseTotal.toFixed(2)}</strong>
              </div>

              <button
                className="btn btn-primary mt-sm"
                onClick={handleAddPurchase}
              >
                Create Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Purchases List ---------- */}
      <h3 className="mt-md">All Purchases</h3>

      {/* Desktop table */}
      <div className="customers-table-wrapper stock-table-wrapper hidden-on-mobile">
        <table className="customers-table">
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
              purchases.map((p) => {
                const supplier =
                  suppliers.find((s) => s.id === p.purchase.supplier_id)
                    ?.name || "N/A";

                return (
                  <React.Fragment key={p.purchase.id}>
                    <tr>
                      <td>
                        <button
                          className="icon-btn"
                          onClick={() => toggleExpand(p.purchase.id)}
                        >
                          {expanded[p.purchase.id] ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </td>

                      <td>{supplier}</td>
                      <td>{p.purchase.total_amount.toFixed(2)}</td>
                      <td>{p.purchase.payment_method}</td>
                      <td>{p.items.length}</td>
                      <td>
                        {new Date(p.purchase.created_at).toLocaleString()}
                      </td>
                    </tr>

                    {/* Expandable items */}
                    {expanded[p.purchase.id] && (
                      <tr>
                        <td colSpan="6">
                          <table className="expanded-card">
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
                                  <td>
                                    {(i.quantity * i.unit_price).toFixed(2)}
                                  </td>
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

      {/* Mobile cards with expandable items */}
<div className="stock-cards hidden-desktop">
  {purchases.map((p) => {
    const supplier =
      suppliers.find((s) => s.id === p.purchase.supplier_id)?.name || "N/A";

    return (
      <div key={p.purchase.id} className="card flex flex-col gap-sm">
        {/* Header */}
        <div className="flex justify-between items-center">
          <strong className="text-md">{supplier}</strong>

          <button
            className="icon-btn"
            onClick={() => toggleExpand(p.purchase.id)}
          >
            {expanded[p.purchase.id] ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
        </div>

        {/* Summary */}
        <div className="text-sm">
          <span className="text-muted">Total:</span>{" "}
          <strong>{p.purchase.total_amount.toFixed(2)}</strong>
        </div>

        <div className="text-sm">
          <span className="text-muted">Payment:</span>{" "}
          {p.purchase.payment_method}
        </div>

        <div className="text-sm">
          <span className="text-muted">Items:</span> {p.items.length}
        </div>

        <div className="text-sm text-muted">
          {new Date(p.purchase.created_at).toLocaleString()}
        </div>

        {/* Expandable items */}
        {expanded[p.purchase.id] && (
          <div className="expanded-card mt-sm">
            <ul className="expanded-list">
              {p.items.map((i, idx) => (
                <li key={idx} className="expanded-list-item">
                  <span className="item-name">{i.name}</span>
                  <span className="item-qty ">{i.quantity}</span>
                  <span className="item-price mr-sm">
                    {i.unit_price.toFixed(2)}
                  </span>
                  <span className="item-total">
                    {(i.quantity * i.unit_price).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  })}
</div>

    </section>
  );
}
