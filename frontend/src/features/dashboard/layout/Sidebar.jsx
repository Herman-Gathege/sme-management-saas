// frontend/src/features/dashboard/layout/Sidebar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import styles from "./DashboardLayout.module.css";

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const isStaff = user.role === "staff";
  const isOwner = user.role === "owner";

  return (
    <aside className={styles.sidebar}>
      <ul>
        {/* HOME */}
        <li>
          <Link to={isOwner ? "/dashboard" : "/staff/dashboard"}>Home</Link>
        </li>

        {/* SALES */}
        <li>
          <Link to={isOwner ? "/sales" : "/staff/dashboard"}>Sales</Link>
        </li>

        {/* STAFF-ONLY */}
        {isStaff && (
          <>
            <li>
              <Link to="/staff/profile">My Profile</Link>
            </li>
            <li>
              <Link to="/staff/password">Change Password</Link>
            </li>
          </>
        )}

        {/* OWNER-ONLY */}
        {isOwner && (
          <>
            <li>
              <Link to="/stock">Stock</Link>
            </li>
            <li>
              <Link to="/customers">Customers</Link>
            </li>
            <li>
              <Link to="/staff">Staff</Link>
            </li>
            <li>
              <Link to="/staff/create">Add Staff</Link>
            </li>
            <li>
              <Link to="/reports">Reports</Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}
