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
import styles from "./StaffManagement.module.css";
import { FiEdit, FiLock, FiUnlock, FiRefreshCw } from "react-icons/fi";

export default function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingStaff, setEditingStaff] = useState(null);
  const token = localStorage.getItem("token");

  const fetchStaff = async () => {
    setLoading(true);
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

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
  };

  const clearEditingStaff = () => {
    setEditingStaff(null);
  };

  return (
    <div className={styles.dashboardPage}>
      <header className={styles.pageHeader}>
        <h2>Staff Management</h2>
        <CreateStaff onCreated={fetchStaff} />
      </header>

      {message && <p className={styles.message}>{message}</p>}

      <section className={styles.card}>
        <h3>Staff List</h3>
        {loading ? (
          <p>Loading...</p>
        ) : staffList.length === 0 ? (
          <p>No staff available.</p>
        ) : (
          <table className={styles.staffTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s) => (
                <tr key={s.id}>
                  <td>{s.full_name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.is_active ? "Active" : "Inactive"}</td>
                  <td className={styles.actionsCell}>
                    {/* Edit */}
                    <button
                      onClick={() => handleEditClick(s)}
                      className={styles.iconBtn}
                      title="Edit staff"
                    >
                      <FiEdit />
                    </button>

                    {s.is_active ? (
                      <>
                        {/* Deactivate */}
                        <button
                          onClick={() => handleDeactivate(s.id)}
                          className={`${styles.iconBtn} ${styles.danger}`}
                          title="Deactivate staff"
                        >
                          <FiLock />
                        </button>

                        {/* Reset Password */}
                        <button
                          onClick={() => handleResetPassword(s.id)}
                          className={styles.iconBtn}
                          title="Reset password"
                        >
                          <FiRefreshCw />
                        </button>
                      </>
                    ) : (
                      /* Reactivate */
                      <button
                        onClick={() => handleReactivate(s.id)}
                        className={`${styles.iconBtn} ${styles.success}`}
                        title="Reactivate staff"
                      >
                        <FiUnlock />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Edit Staff Modal */}
      {editingStaff && (
        <EditStaff
          staff={editingStaff}
          onUpdated={fetchStaff}
          onClose={clearEditingStaff}
        />
      )}
    </div>
  );
}
