import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import styles from "./DashboardLayout.module.css";
import { FiChevronDown } from "react-icons/fi";

export default function Sidebar() {
  const { user, organization } = useAuth();
  const location = useLocation();

  // ---------------------------
  // STATE & HOOKS (ALWAYS FIRST)
  // ---------------------------
  const [stockOpen, setStockOpen] = useState(false);

  // ---------------------------
  // STOCK ROUTES
  // ---------------------------
  const stockRoutes = [
    "/owner/stock",
    "/owner/stock/add",
    "/owner/stock/history",
  ];

  const isStockRouteActive = () =>
    stockRoutes.some(
      (route) =>
        location.pathname === route ||
        location.pathname.match(/^\/owner\/stock\/\d+\/edit$/)
    );

  // Auto-open stock dropdown when navigating to stock pages
  useEffect(() => {
    if (isStockRouteActive()) {
      setStockOpen(true);
    }
  }, [location.pathname]);

  // ---------------------------
  // EARLY RETURN (AFTER HOOKS)
  // ---------------------------
  if (!user) return null;

  const isStaff = user.role === "staff";
  const isOwner = user.role === "owner";

  // ---------------------------
  // HELPERS
  // ---------------------------
  const getLinkClass = ({ isActive }, path) => {
    const active = path ? location.pathname.startsWith(path) : isActive;
    return active ? `${styles.link} ${styles.active}` : styles.link;
  };

  const getButtonClass = (active) =>
    active ? `${styles.link} ${styles.active}` : styles.link;

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>
        {organization?.name || "SmartShop"}
      </h2>

      <nav>
        {/* OWNER HOME */}
        {isOwner && (
          <NavLink
            to="/dashboard"
            className={(nav) => getLinkClass(nav, "/dashboard")}
          >
            Home
          </NavLink>
        )}

        {/* SALES */}
        {isOwner && (
          <NavLink
            to="/owner/sales"
            className={(nav) => getLinkClass(nav, "/owner/sales")}
          >
            View All Sales
          </NavLink>
        )}

        {/* STAFF LINKS */}
        {isStaff && (
          <>
            <NavLink
              to="/staff/profile"
              className={(nav) => getLinkClass(nav, "/staff/profile")}
            >
              My Profile
            </NavLink>
            <NavLink
              to="/staff/password"
              className={(nav) => getLinkClass(nav, "/staff/password")}
            >
              Change Password
            </NavLink>
          </>
        )}

        {/* OWNER LINKS */}
        {isOwner && (
          <>
            {/* STOCK DROPDOWN */}
            <button
              type="button"
              className={getButtonClass(isStockRouteActive())}
              onClick={() => setStockOpen((prev) => !prev)}
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
                <NavLink to="/owner/stock" end className={getLinkClass}>
                  Stock List
                </NavLink>
                <NavLink to="/owner/stock/add" className={getLinkClass}>
                  Add Stock
                </NavLink>
                <NavLink
                  to="/owner/stock/history"
                  className={getLinkClass}
                >
                  Stock History
                </NavLink>
              </div>
            )}

            <NavLink
              to="/customers"
              className={(nav) => getLinkClass(nav, "/customers")}
            >
              Customers
            </NavLink>

            <NavLink
              to="/owner/staff"
              className={(nav) => getLinkClass(nav, "/owner/staff")}
            >
              Manage Staff
            </NavLink>

            <NavLink
              to="/reports"
              className={(nav) => getLinkClass(nav, "/reports")}
            >
              View Reports
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
