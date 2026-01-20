import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import styles from "./DashboardLayout.module.css";
import { FiChevronDown } from "react-icons/fi";

export default function Sidebar() {
  const { user, organization } = useAuth();
  const location = useLocation();

  const [stockOpen, setStockOpen] = useState(false);

  if (!user) return null;

  const isOwner = user.role === "owner";
  const isStaff = user.role === "staff";

  // ---------------------------
  // STOCK ROUTES
  // ---------------------------
  const stockRoutes = [
    "/owner/stock",
    "/owner/stock/add",
    "/owner/stock/history",
  ];

  const isStockRouteActive = stockRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  // Auto-open dropdown when inside stock section
  useEffect(() => {
    if (isStockRouteActive) {
      setStockOpen(true);
    }
  }, [isStockRouteActive]);

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>
        {organization?.name || "SmartShop"}
      </h2>

      <nav>
        {/* ================= OWNER ================= */}
        {isOwner && (
          <>
            <NavLink to="/owner/dashboard" end className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/owner/sales" className={linkClass}>
              View All Sales
            </NavLink>

            {/* STOCK DROPDOWN */}
            <button
              type="button"
              className={`${styles.link} ${
                isStockRouteActive ? styles.active : ""
              }`}
              onClick={() => setStockOpen((o) => !o)}
            >
              <span>Manage Stock</span>
              <FiChevronDown
                className={styles.chevron}
                style={{
                  transform: stockOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {stockOpen && (
              <div className={styles.subMenu}>
                <NavLink to="/owner/stock" end className={linkClass}>
                  Stock List
                </NavLink>

                <NavLink to="/owner/stock/add" className={linkClass}>
                  Add Stock
                </NavLink>

                <NavLink to="/owner/stock/history" className={linkClass}>
                  Stock History
                </NavLink>
              </div>
            )}

            <NavLink to="/customers" className={linkClass}>
              Customers
            </NavLink>

            <NavLink to="/owner/staff" className={linkClass}>
              Manage Staff
            </NavLink>

            <NavLink to="/reports" className={linkClass}>
              View Reports
            </NavLink>
          </>
        )}

        {/* ================= STAFF ================= */}
        {isStaff && (
          <>
            <NavLink to="/staff" end className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/staff/profile" className={linkClass}>
              My Profile
            </NavLink>

            <NavLink to="/staff/password" className={linkClass}>
              Change Password
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
