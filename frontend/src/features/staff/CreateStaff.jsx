// frontend/src/features/staff/CreateStaff.jsx
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

export default function CreateStaff({ staff = null, onClose }) {
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

  // Pre-fill form if editing
  useEffect(() => {
    if (staff) {
      setFormData({
        full_name: staff.full_name,
        email: staff.email,
        phone: staff.phone,
      });
    } else {
      setFormData({ full_name: "", email: "", phone: "" });
    }
  }, [staff]);

  // Fetch staff list
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await apiListStaff(token);
      setStaffList(res.staff || []);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Create or update staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (staff) {
        const res = await apiUpdateStaff(staff.id, formData, token);
        setMessage(`Staff ${res.staff.full_name} updated`);
      } else {
        const res = await apiCreateStaff(formData, token);
        setMessage(`Staff created! Temporary password: ${res.temporary_password}`);
      }

      setFormData({ full_name: "", email: "", phone: "" });
      fetchStaff();
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Server error or invalid input");
    }
  };

  // Table actions
  const handleEdit = (s) => setFormData({ full_name: s.full_name, email: s.email, phone: s.phone });

  const handleDeactivate = async (id) => {
    setMessage("");
    try {
      await apiDeactivateStaff(id, token);
      setMessage("Staff deactivated");
      fetchStaff();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to deactivate staff");
    }
  };

  const handleReactivate = async (id) => {
    setMessage("");
    try {
      await apiReactivateStaff(id, token);
      setMessage("Staff reactivated");
      fetchStaff();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to reactivate staff");
    }
  };

  const handleResetPassword = async (id) => {
    if (!window.confirm("Generate a temporary password for this staff?")) return;
    try {
      const res = await apiResetPassword(id, token);
      alert(`Temporary password: ${res.temporary_password}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to reset password");
    }
  };

  return (
    <div className={onClose ? styles.overlay : ""}>
      <div className={onClose ? styles.modal : ""}>
        <h2>Welcome, {organization?.name} 👋</h2>

        {message && <p className={styles.message}>{message}</p>}

        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <h3>{staff ? "Edit Staff" : "Create Staff"}</h3>

          <input
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.inputField}
            required
          />

          <div className={styles.actions}>
            <button className={styles.submitButton}>
              {staff ? "Update Staff" : "Create Staff"}
            </button>
            {onClose && (
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {!staff && (
          <>
            <h3>Staff List</h3>
            {loading ? (
              <p>Loading...</p>
            ) : staffList.length === 0 ? (
              <p>No staff yet.</p>
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
                        <button className={styles.editButton} onClick={() => handleEdit(s)}>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}
