// frontend/src/features/staff/EditStaff.jsx
import { useState, useEffect } from "react";
import StaffForm from "./StaffForm";
import { updateStaff as apiUpdateStaff } from "../../api/staff";
import styles from "./StaffForm.module.css";

export default function EditStaff({ staff, onUpdated, onClose }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [formKey, setFormKey] = useState(0); // force form remount
  const token = localStorage.getItem("token");

  // Open modal automatically when staff prop changes
  useEffect(() => {
    if (staff) {
      setModalOpen(true);
      setFormKey(prev => prev + 1); // reset form each time a staff is edited
    }
  }, [staff]);

  if (!staff) return null; // nothing to edit

  const handleSubmit = async (formData) => {
    setMessage("");
    try {
      const res = await apiUpdateStaff(staff.id, formData, token);
      setMessage(`Staff ${res.staff.full_name} updated successfully`);
      setModalOpen(false);
      if (onUpdated) onUpdated(); // refresh parent list
      if (onClose) onClose();     // clear editing selection
    } catch (err) {
      setMessage(err.message || "Server error or invalid input");
    }
  };

  return (
    <div>
      {message && <p className={styles.message}>{message}</p>}

      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit Staff</h3>
            <StaffForm
              key={formKey}           // important: force remount to reset inputs
              initialData={staff}     // pass selected staff data
              onSubmit={handleSubmit}
              onClose={() => {
                setModalOpen(false);
                if (onClose) onClose();
              }}
              submitLabel="Update Staff"
            />
          </div>
        </div>
      )}
    </div>
  );
}
