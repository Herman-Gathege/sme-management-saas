import { NavLink } from "react-router-dom";
import styles from "./DashboardLayout.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>SME SaaS</h2>

      <nav>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/dashboard/sales"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Sales
        </NavLink>

        <NavLink
          to="/dashboard/stock"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Stock
        </NavLink>

        <NavLink
          to="/dashboard/staff"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Staff
        </NavLink>

        <NavLink
          to="/dashboard/reports"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Reports
        </NavLink>
      </nav>
    </aside>
  );
}
