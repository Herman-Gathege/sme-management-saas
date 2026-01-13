// frontend/src/features/dashboard/StaffDashboard.jsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import StaffLayout from "./layout/StaffLayout";
import styles from "../dashboard/layout/DashboardLayout.module.css";


// -----------------------------
// Nested Components for Staff
// -----------------------------

export function StaffSales() {
  const { user } = useAuth();
  return (
    <>
      <header className={styles.header}>
        <h2>Welcome, <span>{user.full_name}</span> 👋</h2>
        {/* <p>Organization: {organization?.name}</p>
        <p>Role: Staff</p> */}
      </header>

      <section className={styles.card}>
        <h3>Sales</h3>
        <p>Sales functionality will appear here.</p>
      </section>
    </>
  );
}

export function StaffProfile() {
  const { user } = useAuth();
  return (
    <section className={styles.card}>
      <h3>My Profile</h3>
      <div className={styles.profileRow}>
        <strong>Name:</strong> {user.full_name}
      </div>
      <div className={styles.profileRow}>
        <strong>Email:</strong> {user.email}
      </div>
    </section>
  );
}

export function StaffPassword() {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://127.0.0.1:5000/api/staff/${user.id}/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ new_password: newPassword }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password update failed");

      setMessage("Password updated successfully");
      setNewPassword("");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.card}>
      <h3>Change Password</h3>
      <form onSubmit={handlePasswordChange} className={styles.form}>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </section>
  );
}

// -----------------------------
// StaffDashboard Layout
// -----------------------------
// StaffDashboard layout

export default function StaffDashboard() {
  return (
    <StaffLayout>
      <Outlet />
    </StaffLayout>
  );
}
