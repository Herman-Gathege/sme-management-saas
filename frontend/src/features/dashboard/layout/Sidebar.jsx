// frontend/src/features/dashboard/layout/Sidebar.jsx

import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import styles from "./DashboardLayout.module.css";

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside className={styles.sidebar}>
      <ul>
        {/* Shared links */}
        <li>
          <Link to="/dashboard">Home</Link>
        </li>

        <li>
          <Link to="/sales">Sales</Link>
        </li>

        {/* Owner-only links */}
        {user.role === "owner" && (
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
