// frontend/src/features/staff/StaffDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CreateStaff from "../staff/CreateStaff";
import {
  listStaff,
  deactivateStaff,
  reactivateStaff,
  resetStaffPassword,
} from "../../api/staff";
import styles from "../staff/StaffForm.module.css";

const StaffDashboard = () => {
  const { user, organization } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingStaff, setEditingStaff] = useState(null);

  const isOwner = user.role === "owner";
  const isStaff = user.role === "staff";

  // Fetch staff list
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const data = await listStaff();
      let staffData = data.staff || data;

      // Staff sees only themselves
      if (isStaff) {
        staffData = staffData.filter((s) => s.id === user.id);
      }

      setStaffList(staffData);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Deactivate staff (owner only)
  const handleDeactivate = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this staff?")) return;
    try {
      await deactivateStaff(id);
      fetchStaff();
    } catch (err) {
      alert(err.message || "Failed to deactivate staff");
    }
  };

  // Reactivate staff (owner only)
  const handleReactivate = async (id) => {
    try {
      await reactivateStaff(id);
      fetchStaff();
    } catch (err) {
      alert(err.message || "Failed to reactivate staff");
    }
  };

  // Reset staff password
  const handleResetPassword = async (id) => {
    if (!window.confirm("Generate a temporary password for this staff?")) return;
    try {
      const res = await resetStaffPassword(id);
      alert(`Temporary password: ${res.temporary_password}`);
    } catch (err) {
      alert(err.message || "Failed to reset password");
    }
  };

  // Open edit modal
  const handleEdit = (staff) => {
    setEditingStaff(staff);
  };

  const handleModalClose = () => {
    setEditingStaff(null);
    fetchStaff();
  };

  return (
    <div className={styles.dashboardWrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>{organization?.name}</h3>
        <ul className={styles.sidebarMenu}>
          <li>Home</li>
          <li>Sales</li>
          {isOwner && <li>Stock</li>}
          {isOwner && <li>Customers</li>}
          {isOwner && <li>Staff</li>}
          {isOwner && <li>Add Staff</li>}
          {isOwner && <li>Reports</li>}
          {isStaff && <li>My Profile</li>}
        </ul>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h2>Welcome, {user.full_name} 👋</h2>
          <p>Organization: {organization?.name}</p>
          <p>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        </header>

        {loading && <p>Loading staff...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {/* Owner: Create Staff Modal */}
        {isOwner && (
          <button
            className={styles.createButton}
            onClick={() => setEditingStaff({})}
          >
            Create Staff
          </button>
        )}

        {/* Staff Table */}
        {!loading && staffList.length > 0 && (
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
                  <td>
                    {isOwner && (
                      <>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEdit(s)}
                        >
                          Edit
                        </button>
                        {s.is_active ? (
                          <>
                            <button
                              className={styles.deactivateButton}
                              onClick={() => handleDeactivate(s.id)}
                            >
                              Deactivate
                            </button>
                            <button
                              className={styles.resetButton}
                              onClick={() => handleResetPassword(s.id)}
                            >
                              Reset Password
                            </button>
                          </>
                        ) : (
                          <button
                            className={styles.reactivateButton}
                            onClick={() => handleReactivate(s.id)}
                          >
                            Reactivate
                          </button>
                        )}
                      </>
                    )}

                    {isStaff && s.id === user.id && (
                      <button
                        className={styles.resetButton}
                        onClick={() => handleResetPassword(s.id)}
                      >
                        Reset Password
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && staffList.length === 0 && (
          <p>No staff found.</p>
        )}

        {/* Create/Edit Modal */}
        {editingStaff && (
          <CreateStaff
            staff={editingStaff?.id ? editingStaff : null}
            onClose={handleModalClose}
          />
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;
