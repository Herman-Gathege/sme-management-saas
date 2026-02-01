// frontend/src/features/suppliers/OwnerPurchases.jsx
import { useEffect, useState } from "react";
import { listSuppliers, listPurchases, createPurchase } from "../../api/suppliers";
import './SupplierModule.css';

export default function OwnerSupplierPurchases() {
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [newPurchase, setNewPurchase] = useState({
    supplier_id: "",
    payment_method: "credit",
    items: []
  });
  const [expanded, setExpanded] = useState({}); // Tracks expanded rows

  const fetchData = async () => {
    try {
      setSuppliers(await listSuppliers());
      setPurchases(await listPurchases());
    } catch (err) {
      console.error(err);
      alert("Error fetching data: " + err.message);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Add new empty item row
  const addItem = () => {
    setNewPurchase({
      ...newPurchase,
      items: [...newPurchase.items, { name: "", quantity: "", unit_price: "" }]
    });
  };

  // Remove item row
  const removeItem = (index) => {
    const updatedItems = [...newPurchase.items];
    updatedItems.splice(index, 1);
    setNewPurchase({ ...newPurchase, items: updatedItems });
  };

  // Update item fields
  const updateItem = (index, field, value) => {
    const updatedItems = [...newPurchase.items];
    updatedItems[index][field] = value;
    setNewPurchase({ ...newPurchase, items: updatedItems });
  };

  // Submit new purchase
  const handleAddPurchase = async () => {
    if (!newPurchase.supplier_id || newPurchase.items.length === 0) {
      return alert("Supplier and at least one item are required");
    }

    // Validate items
    for (const item of newPurchase.items) {
      if (!item.name || !item.quantity || !item.unit_price) {
        return alert("All item fields are required");
      }
      item.quantity = parseFloat(item.quantity);
      item.unit_price = parseFloat(item.unit_price);
      if (isNaN(item.quantity) || isNaN(item.unit_price)) {
        return alert("Quantity and unit price must be valid numbers");
      }
    }

    try {
      await createPurchase(newPurchase);
      setNewPurchase({ supplier_id: "", payment_method: "credit", items: [] });
      fetchData();
    } catch (err) {
      alert("Error creating purchase: " + err.message);
    }
  };

  // Toggle row expansion
  const toggleExpand = (purchaseId) => {
    setExpanded(prev => ({ ...prev, [purchaseId]: !prev[purchaseId] }));
  };

  return (
    <div className="content">
      <h2>Supplier Purchases</h2>

      {/* ---------- New Purchase Form ---------- */}
      <div className="purchase-form">
        <div className="purchase-controls">
          <select
            value={newPurchase.supplier_id}
            onChange={e => setNewPurchase({ ...newPurchase, supplier_id: e.target.value })}
          >
            <option value="">Select Supplier</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={newPurchase.payment_method}
            onChange={e => setNewPurchase({ ...newPurchase, payment_method: e.target.value })}
          >
            <option value="credit">Credit</option>
            <option value="cash">Cash</option>
            <option value="mpesa">Mpesa</option>
            <option value="bank">Bank</option>
          </select>

          <button type="button" className="btn-small" onClick={addItem}>
            + Add Item
          </button>
        </div>

        {/* Inline items table */}
        {newPurchase.items.length > 0 && (
          <table className="items-form-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {newPurchase.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      placeholder="Name"
                      value={item.name}
                      onChange={e => updateItem(index, "name", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={e => updateItem(index, "quantity", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unit_price}
                      onChange={e => updateItem(index, "unit_price", e.target.value)}
                    />
                  </td>
                  <td>
                    <button type="button" className="btn-small remove-btn" onClick={() => removeItem(index)}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className="btn-primary" onClick={handleAddPurchase}>Create Purchase</button>
      </div>

      {/* ---------- Purchases Table ---------- */}
      <h3>All Purchases</h3>
      <table className="payments-table">
        <thead>
          <tr>
            <th></th> {/* Arrow column */}
            <th>Supplier</th>
            <th>Total Amount</th>
            <th>Payment Method</th>
            <th>#Items</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {purchases.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No purchases found</td>
            </tr>
          ) : (
            purchases.map(p => {
              const purchase = p.purchase;
              const items = p.items || [];
              const supplierName = suppliers.find(s => s.id === purchase.supplier_id)?.name || "N/A";
              const isExpanded = expanded[purchase.id] || false;

              return (
                <tbody key={purchase.id}>
                  <tr className="purchase-row">
                    <td onClick={() => toggleExpand(purchase.id)} style={{ cursor: "pointer" }}>
                      {isExpanded ? "▼" : "▶"}
                    </td>
                    <td>{supplierName}</td>
                    <td>{purchase.total_amount}</td>
                    <td>{purchase.payment_method}</td>
                    <td>{items.length}</td>
                    <td>{new Date(purchase.created_at || purchase.date).toLocaleString()}</td>
                  </tr>
                  {isExpanded && (
                    <tr className="items-row">
                      <td colSpan="6">
                        <table className="items-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Quantity</th>
                              <th>Unit Price</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item, idx) => (
                              <tr key={idx}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit_price}</td>
                                <td>{item.quantity * item.unit_price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </tbody>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
