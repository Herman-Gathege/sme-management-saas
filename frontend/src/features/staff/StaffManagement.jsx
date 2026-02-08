// frontend/src/features/staff/StaffManagement.jsx
import { useState, useEffect } from "react";
import CreateStaff from "./CreateStaff";
import EditStaff from "./EditStaff";
import {
  listStaff as apiListStaff,
  deactivateStaff as apiDeactivateStaff,
  reactivateStaff as apiReactivateStaff,
  resetStaffPassword as apiResetPassword,
} from "../../api/staff";
import { FiEdit, FiLock, FiUnlock, FiRefreshCw, FiInfo } from "react-icons/fi";

export default function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingStaff, setEditingStaff] = useState(null);

  const token = localStorage.getItem("token");

  /* =====================
     DATA FETCHING
  ====================== */
  const fetchStaff = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await apiListStaff(token);
      setStaffList(res.staff || []);
    } catch (err) {
      setMessage(err.message || "Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  /* =====================
     ACTION HANDLERS
  ====================== */
  const handleDeactivate = async (id) => {
    try {
      await apiDeactivateStaff(id, token);
      fetchStaff();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleReactivate = async (id) => {
    try {
      await apiReactivateStaff(id, token);
      fetchStaff();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleResetPassword = async (id) => {
    try {
      const res = await apiResetPassword(id, token);
      alert(`Temporary password: ${res.temporary_password}`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  /* =====================
     MODAL CONTROLS
  ====================== */
  const handleEditClick = (staff) => setEditingStaff(staff);
  const closeEditModal = () => setEditingStaff(null);

  /* =====================
     RENDER
  ====================== */
  return (
    <div className="flex flex-col gap-lg">
      {/* Header */}
      <header className="flex justify-between items-start flex-wrap gap-md">
        <div>
          <h2 className="text-xl text-bold">Staff Management</h2>
          <p className="hint">
            <FiInfo />
            
            Create, edit, and manage staff access
          </p>
        </div>

        {/* CreateStaff handles its own modal */}
        <CreateStaff onCreated={fetchStaff} />
      </header>

      {/* Message */}
      {message && <div className="card text-sm text-error">{message}</div>}

      {/* Staff List */}
      <section className="card">
        <h3 className="mb-md">Staff List</h3>

        {loading ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : staffList.length === 0 ? (
          <p className="text-sm text-muted">No staff available.</p>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden-mobile w-full overflow-x-auto">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((s) => (
                    <tr key={s.id}>
                      <td>{s.full_name}</td>
                      <td>{s.email}</td>
                      <td>{s.phone}</td>
                      <td>
                        <span
                          className={s.is_active ? "text-success" : "text-muted"}
                        >
                          {s.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-end gap-sm">
                          <button
                            onClick={() => handleEditClick(s)}
                            className="btn-ghost"
                            title="Edit staff"
                          >
                            <FiEdit />
                          </button>

                          {s.is_active ? (
                            <>
                              <button
                                onClick={() => handleDeactivate(s.id)}
                                className="btn-ghost text-error"
                                title="Deactivate staff"
                              >
                                <FiLock />
                              </button>

                              <button
                                onClick={() => handleResetPassword(s.id)}
                                className="btn-ghost"
                                title="Reset password"
                              >
                                <FiRefreshCw />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleReactivate(s.id)}
                              className="btn-ghost text-success"
                              title="Reactivate staff"
                            >
                              <FiUnlock />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="hidden-desktop flex flex-col gap-md">
              {staffList.map((s) => (
                <div key={s.id} className="card">
                  <div className="flex justify-between items-start mb-sm">
                    <div>
                      <p className="text-bold">{s.full_name}</p>
                      <p className="text-sm text-muted">{s.email}</p>
                      <p className="text-sm text-muted">{s.phone}</p>
                    </div>

                    <span
                      className={`text-sm ${
                        s.is_active ? "text-success" : "text-muted"
                      }`}
                    >
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex gap-sm justify-end">
                    <button
                      onClick={() => handleEditClick(s)}
                      className="btn-ghost"
                      title="Edit staff"
                    >
                      <FiEdit />
                    </button>

                    {s.is_active ? (
                      <>
                        <button
                          onClick={() => handleDeactivate(s.id)}
                          className="btn-ghost text-error"
                          title="Deactivate staff"
                        >
                          <FiLock />
                        </button>

                        <button
                          onClick={() => handleResetPassword(s.id)}
                          className="btn-ghost"
                          title="Reset password"
                        >
                          <FiRefreshCw />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleReactivate(s.id)}
                        className="btn-ghost text-success"
                        title="Reactivate staff"
                      >
                        <FiUnlock />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Edit Staff Modal */}
      {editingStaff && (
        <EditStaff
          staff={editingStaff}
          onUpdated={fetchStaff}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}
