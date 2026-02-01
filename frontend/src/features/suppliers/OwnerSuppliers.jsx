// frontend/src/features/suppliers/OwnerSuppliers.jsx
import { useEffect, useState } from "react";
import { listSuppliers, createSupplier, deactivateSupplier } from "../../api/suppliers";
import './SupplierModule.css';

export default function OwnerSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSupplier, setNewSupplier] = useState({ name: "", phone: "", email: "", address: "", notes: "" });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await listSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreate = async () => {
    if (!newSupplier.name) return alert("Supplier name required");
    try {
      await createSupplier(newSupplier);
      setNewSupplier({ name: "", phone: "", email: "", address: "", notes: "" });
      fetchSuppliers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="ownersuppliers-container">
      <h2>Suppliers</h2>

      <div className="ownersuppliers-form">
        <input placeholder="Name" value={newSupplier.name} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} />
        <input placeholder="Phone" value={newSupplier.phone} onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})} />
        <input placeholder="Email" value={newSupplier.email} onChange={e => setNewSupplier({...newSupplier, email: e.target.value})} />
        <input placeholder="Address" value={newSupplier.address} onChange={e => setNewSupplier({...newSupplier, address: e.target.value})} />
        <input placeholder="Notes" value={newSupplier.notes} onChange={e => setNewSupplier({...newSupplier, notes: e.target.value})} />
        <button className="btn-add-supplier" onClick={handleCreate}>Add Supplier</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <table className="ownersuppliers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.phone}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{s.notes}</td>
                <td>
                  <button className="btn-deactivate" onClick={() => deactivateSupplier(s.id).then(fetchSuppliers)}>Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
