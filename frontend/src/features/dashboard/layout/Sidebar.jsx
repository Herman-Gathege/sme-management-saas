// frontend/src/features/dashboard/layout/Sidebar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import styles from "./DashboardLayout.module.css";

export default function Sidebar() {
  const { user, organization } = useAuth();
  const location = useLocation();

  // ---------------------------
  // Hooks (must always run)
  // ---------------------------
  const [stockOpen, setStockOpen] = useState(false);

  const isStaff = user?.role === "staff";
  const isOwner = user?.role === "owner";

  // Auto-open Stock dropdown if current path starts with /owner/stock
  useEffect(() => {
    if (location.pathname.startsWith("/owner/stock")) {
      setStockOpen(true);
    }
  }, [location.pathname]);

  // Dynamic class for NavLink
  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  // ---------------------------
  // Early return for unauthenticated
  // ---------------------------
  if (!user) return null;

  // ---------------------------
  // Render Sidebar
  // ---------------------------
  return (
    <aside className={styles.sidebar}>
      {/* LOGO */}
      <h2 className={styles.logo}>
        {organization?.name || "SmartShop"}
      </h2>

      <nav>
        {/* HOME */}
        <NavLink
          to={isOwner ? "/dashboard" : "/staff/dashboard"}
          className={linkClass}
        >
          Home
        </NavLink>

        {/* SALES */}
        <NavLink
          to={isOwner ? "/sales" : "/staff/dashboard"}
          className={linkClass}
        >
          Sales
        </NavLink>

        {/* STAFF ONLY */}
        {isStaff && (
          <>
            <NavLink to="/staff/profile" className={linkClass}>
              My Profile
            </NavLink>
            <NavLink to="/staff/password" className={linkClass}>
              Change Password
            </NavLink>
          </>
        )}

        {/* OWNER ONLY */}
        {isOwner && (
          <>
            {/* STOCK DROPDOWN TRIGGER */}
            <button
              type="button"
              onClick={() => setStockOpen(!stockOpen)}
              className={styles.link}
              style={{ background: "none", border: "none", width: "100%", textAlign: "left" }}
            >
              Stock
            </button>

            {/* STOCK SUB-MENU */}
            {stockOpen && (
              <div style={{ marginLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <NavLink
                  to="/owner/stock"
                  end
                  className={({ isActive }) =>
                    location.pathname === "/owner/stock" ||
                    location.pathname.match(/^\/owner\/stock\/\d+\/edit$/)
                      ? `${styles.link} ${styles.active}`
                      : styles.link
                  }
                >
                  Stock List
                </NavLink>

                <NavLink
                  to="/owner/stock/add"
                  className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
                >
                  Add Stock
                </NavLink>

                <NavLink
                  to="/owner/stock/history"
                  className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
                >
                  Stock History
                </NavLink>
              </div>
            )}

            {/* Other Owner Links */}
            <NavLink to="/customers" className={linkClass}>
              Customers
            </NavLink>

            <NavLink to="/owner/staff/create" className={linkClass}>
              Manage Staff
            </NavLink>

            <NavLink to="/reports" className={linkClass}>
              Reports
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
