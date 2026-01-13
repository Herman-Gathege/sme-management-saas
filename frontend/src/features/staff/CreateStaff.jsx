// frontend/src/features/staff/CreateStaff.jsx
import { useState, useEffect } from "react";
import StaffForm from "./StaffForm";
import { createStaff as apiCreateStaff } from "../../api/staff";
import styles from "./StaffForm.module.css";

export default function CreateStaff({ onCreated }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [formKey, setFormKey] = useState(0); // key to reset form
  const token = localStorage.getItem("token");

  const handleSubmit = async (formData) => {
    setMessage("");
    try {
      const res = await apiCreateStaff(formData, token);
      setMessage(`Staff created! Temporary password: ${res.temporary_password}`);
      setModalOpen(false);
      if (onCreated) onCreated();
    } catch (err) {
      setMessage(err.message || "Server error or invalid input");
    }
  };

  // Reset form each time modal opens
  useEffect(() => {
    if (modalOpen) setFormKey(prev => prev + 1);
  }, [modalOpen]);

  return (
    <div>
      <button className={styles.primaryBtn} onClick={() => setModalOpen(true)}>
        Create New Staff
      </button>

      {message && <p className={styles.message}>{message}</p>}

      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Create New Staff</h3>
            <StaffForm
              key={formKey}               // important: force re-mount to reset inputs
              initialData={{}}             // important: controlled inputs need an object
              onSubmit={handleSubmit}
              onClose={() => setModalOpen(false)}
              submitLabel="Create Staff"
            />
          </div>
        </div>
      )}
    </div>
  );
}
