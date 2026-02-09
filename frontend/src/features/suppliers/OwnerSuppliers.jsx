// frontend/src/features/suppliers/OwnerSuppliers.jsx
import { useEffect, useState } from "react";
import {
  listSuppliers,
  createSupplier,
  deactivateSupplier,
} from "../../api/suppliers";
// import './SupplierModule.css';

export default function OwnerSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

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
      setNewSupplier({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      });
      setShowModal(false);
      fetchSuppliers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="card">
      <div className="flex-between">
        <h2>Suppliers</h2>
        <button className="btn btn-primary mb-md" onClick={() => setShowModal(true)}>
          + Add Supplier
        </button>
      </div>

      {/* <form className="form-stack">
        <input
          className="input"
          placeholder="Name"
          value={newSupplier.name}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, name: e.target.value })
          }
        />
        <input
          className="input"
          placeholder="Phone"
          value={newSupplier.phone}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, phone: e.target.value })
          }
        />
        <input
          className="input"
          placeholder="Email"
          value={newSupplier.email}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, email: e.target.value })
          }
        />
        <input
          className="input"
          placeholder="Address"
          value={newSupplier.address}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, address: e.target.value })
          }
        />
        <input
          className="input"
          placeholder="Notes"
          value={newSupplier.notes}
          onChange={(e) =>
            setNewSupplier({ ...newSupplier, notes: e.target.value })
          }
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleCreate}
        >
          Add Supplier
        </button>
      </form> */}

      {/* ========== MODAL ========== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Add Supplier</h3>

            <form className="form-stack">
              <input
                className="input"
                placeholder="Name"
                value={newSupplier.name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, name: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Phone"
                value={newSupplier.phone}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, phone: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Email"
                value={newSupplier.email}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, email: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Address"
                value={newSupplier.address}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, address: e.target.value })
                }
              />
              <input
                className="input"
                placeholder="Notes"
                value={newSupplier.notes}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, notes: e.target.value })
                }
              />

              <div className="modal-actions">
                
                <button
                  type="button"
                  className="btn btn-primary mr-sm"
                  onClick={handleCreate}
                >
                  Save Supplier
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : suppliers.length === 0 ? (
        <p>No suppliers found.</p>
      ) : (
        <>
          {/* ========== DESKTOP TABLE ========== */}
          <div className="customers-table-wrapper stock-table-wrapper hidden-on-mobile">
            <table className="customers-table">
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
                {suppliers.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.phone}</td>
                    <td>{s.email}</td>
                    <td>{s.address}</td>
                    <td>{s.notes}</td>
                    <td>
                      <button
                        className="icon-btn"
                        onClick={() =>
                          deactivateSupplier(s.id).then(fetchSuppliers)
                        }
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ========== MOBILE CARDS ========== */}
          <div className="stock-cards hidden-on-desktop">
            {suppliers.map((s) => (
              <div key={s.id} className="card supplier-card">
                <div>
                  <strong>{s.name}</strong>
                </div>

                <div>
                  <div>
                    <span>Phone:</span> {s.phone}
                  </div>
                  <div>
                    <span>Email:</span> {s.email}
                  </div>
                  <div>
                    <span>Address:</span> {s.address}
                  </div>
                  {s.notes && (
                    <div>
                      <span>Notes:</span> {s.notes}
                    </div>
                  )}
                </div>

                <div>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      deactivateSupplier(s.id).then(fetchSuppliers)
                    }
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
