//frontend/src/features/staff/CreateStaff.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./StaffForm.module.css";
import {
  createStaff as apiCreateStaff,
  listStaff as apiListStaff,
  updateStaff as apiUpdateStaff,
  deactivateStaff as apiDeactivateStaff,
  reactivateStaff as apiReactivateStaff,
  resetStaffPassword as apiResetPassword,
} from "../../api/staff";

export default function CreateStaff({ staff = null }) {
  const { organization } = useAuth();
  const token = localStorage.getItem("token");

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Prefill form for editing
  useEffect(() => {
    if (staff) {
      setFormData({
        full_name: staff.full_name,
        email: staff.email,
        phone: staff.phone,
      });
      setModalOpen(true);
    } else {
      setFormData({ full_name: "", email: "", phone: "" });
    }
  }, [staff]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await apiListStaff(token);
      setStaffList(res.staff || []);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (staff) {
        const res = await apiUpdateStaff(staff.id, formData, token);
        setMessage(`Staff ${res.staff.full_name} updated`);
      } else {
        const res = await apiCreateStaff(formData, token);
        setMessage(
          `Staff created! Temporary password: ${res.temporary_password}`
        );
      }
      setFormData({ full_name: "", email: "", phone: "" });
      setModalOpen(false);
      fetchStaff();
    } catch (err) {
      setMessage(err.message || "Server error or invalid input");
    }
  };

  const handleEdit = (s) => {
    setFormData({ full_name: s.full_name, email: s.email, phone: s.phone });
    setModalOpen(true);
  };

  const handleDeactivate = async (id) => {
    try {
      await apiDeactivateStaff(id, token);
      fetchStaff();
    } catch {}
  };
  const handleReactivate = async (id) => {
    try {
      await apiReactivateStaff(id, token);
      fetchStaff();
    } catch {}
  };
  const handleResetPassword = async (id) => {
    try {
      const res = await apiResetPassword(id, token);
      alert(res.temporary_password);
    } catch {}
  };

  return (
    <div className={styles.dashboardPage}>
      <header className={styles.pageHeader}>
        <h2>Staff Management</h2>
        <button
          onClick={() => setModalOpen(true)}
          className={styles.primaryBtn}
        >
          Create New Staff
        </button>
        {/* {modalOpen && (
          <button
            onClick={() => setModalOpen(false)}
            className={styles.secondaryBtn}
          >
            Close Form
          </button>
        )} */}
      </header>

      {message && <p className={styles.message}>{message}</p>}

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{staff ? "Edit Staff" : "Create New Staff"}</h3>
            <form className={styles.staffForm} onSubmit={handleSubmit}>
              <input
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <div className={styles.formActions}>
                <button className={styles.primaryBtn}>
                  {staff ? "Update Staff" : "Create Staff"}
                </button>
                {modalOpen && (
                  <button
                    onClick={() => setModalOpen(false)}
                    className={styles.secondaryBtn}
                  >
                    Close Form
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff List */}
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
                  <td>
                    <button
                      onClick={() => handleEdit(s)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    {s.is_active ? (
                      <>
                        <button
                          onClick={() => handleDeactivate(s.id)}
                          className={styles.deactivateBtn}
                        >
                          Deactivate
                        </button>
                        <button
                          onClick={() => handleResetPassword(s.id)}
                          className={styles.resetBtn}
                        >
                          Reset Password
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleReactivate(s.id)}
                        className={styles.reactivateBtn}
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
