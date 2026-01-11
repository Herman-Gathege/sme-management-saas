// frontend/src/features/staff/CreateStaff.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./StaffForm.module.css";

export default function CreateStaff() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);

  const fetchStaff = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/staff/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setStaffList(data.staff || []);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:5000/staff/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ full_name: fullName, email, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Error creating staff");
      } else {
        setMessage(`Staff created! Temporary password: ${data.temporary_password}`);
        setFullName("");
        setEmail("");
        setPhone("");
        fetchStaff();
      }
    } catch (err) {
      console.error(err);
      setMessage("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Staff</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Staff"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <h3>Staff List</h3>
      <ul>
        {staffList.map((s) => (
          <li key={s.id}>
            {s.full_name} | {s.email} | {s.phone} | {s.is_active ? "Active" : "Inactive"}
          </li>
        ))}
      </ul>
    </div>
  );
}
