// frontend/src/features/staff/StaffForm.jsx
import { useState, useEffect } from "react";
// import styles from "./StaffForm.module.css";

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
    <form className="form-stack" onSubmit={handleSubmit}>
      <input
        className="input"
        name="full_name"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={handleChange}
        required
      />
      <input
        className="input"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        className="input"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <div className="flex gap-sm">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        <button type="button" onClick={onClose} className="btn">
          Close
        </button>
      </div>
    </form>
  );
}
