// frontend/src/features/staff/CreateStaff.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./StaffForm.module.css";
import {
  createStaff as apiCreateStaff,
  listStaff as apiListStaff,
  updateStaff as apiUpdateStaff,
  deactivateStaff as apiDeactivateStaff,
} from "../../api/staff";

export default function CreateStaff() {
  const { organization } = useAuth();
  const token = localStorage.getItem("token"); // grab token once

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

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

  // Handle create/update staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (editId) {
        const res = await apiUpdateStaff(editId, formData, token);
        setMessage(`Staff ${res.staff.full_name} updated`);
        setEditId(null);
      } else {
        const res = await apiCreateStaff(formData, token);
        setMessage(`Staff created! Temporary password: ${res.temporary_password}`);
      }

      setFormData({ full_name: "", email: "", phone: "" });
      fetchStaff();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Server error or invalid input");
    }
  };

  // Handle edit
  const handleEdit = (staff) => {
    setEditId(staff.id);
    setFormData({
      full_name: staff.full_name,
      email: staff.email,
      phone: staff.phone,
    });
  };

  // Handle deactivate
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

  return (
    <div className={styles.container}>
      <h2>Welcome, {organization?.name} 👋</h2>

      {message && <p className={styles.message}>{message}</p>}

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h3>{editId ? "Edit Staff" : "Create Staff"}</h3>

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

        <button className={styles.submitButton}>
          {editId ? "Update Staff" : "Create Staff"}
        </button>
      </form>

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
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </button>
                  {s.is_active && (
                    <button
                      className={styles.deactivateButton}
                      onClick={() => handleDeactivate(s.id)}
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
