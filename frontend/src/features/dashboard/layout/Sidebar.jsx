import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import styles from "./DashboardLayout.module.css";

export default function Sidebar() {
  const { organization } = useAuth(); // grab org from context

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>
        {organization?.name || "SmartShop"} {/* fallback just in case */}
      </h2>

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
