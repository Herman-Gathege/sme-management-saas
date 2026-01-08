import { NavLink } from "react-router-dom";
import styles from "./DashboardLayout.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>SME SaaS</h2>

      <nav>
        <NavLink to="/dashboard" className={styles.link}>Dashboard</NavLink>
        <NavLink to="/dashboard/sales" className={styles.link}>Sales</NavLink>
        <NavLink to="/dashboard/stock" className={styles.link}>Stock</NavLink>
        <NavLink to="/dashboard/staff" className={styles.link}>Staff</NavLink>
        <NavLink to="/dashboard/reports" className={styles.link}>Reports</NavLink>
      </nav>
    </aside>
  );
}
