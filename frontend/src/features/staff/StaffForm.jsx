// frontend/src/features/staff/StaffForm.jsx
import { useState, useEffect } from "react";
import styles from "./StaffForm.module.css";

export default function StaffForm({ initialData = {}, onSubmit, onClose, submitLabel }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  // Prefill form if editing
  useEffect(() => {
    setFormData({
      full_name: initialData?.full_name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
    });
  }, [initialData]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
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
        <button type="submit" className={styles.primaryBtn}>
          {submitLabel}
        </button>
        <button type="button" onClick={onClose} className={styles.secondaryBtn}>
          Close
        </button>
      </div>
    </form>
  );
}
