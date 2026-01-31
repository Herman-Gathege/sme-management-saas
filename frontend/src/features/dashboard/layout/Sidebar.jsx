// frontend/src/features/dashboard/layout/Sidebar.jsx
import { NavLink, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import styles from "./DashboardLayout.module.css";
import {
  FiChevronDown,
  FiHome,
  FiBarChart2,
  FiBox,
  FiUsers,
  FiFileText,
} from "react-icons/fi";

export default function Sidebar() {
  const { user, organization } = useAuth();
  const location = useLocation();

  const [stockOpen, setStockOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isOwner = user?.role === "owner";
  const isStaff = user?.role === "staff";

  // ---------------------------
  // STOCK ROUTES
  // ---------------------------
  const stockRoutes = ["/owner/stock", "/owner/stock/add", "/owner/stock/history"];
  const isStockRouteActive = stockRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    if (isStockRouteActive) setStockOpen(true);
  }, [isStockRouteActive]);

  // ---------------------------
  // CUSTOMER ROUTES
  // ---------------------------
  const customerRoutes = [
    "/owner/customers/debtors",
    "/owner/customers/creditors",
    "/owner/customers/add",
  ];
  const isCustomerRouteActive = customerRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    if (isCustomerRouteActive) setCustomerOpen(true);
  }, [isCustomerRouteActive]);

  if (!user) return null;

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.header}>
        {!collapsed && <h2 className={styles.logo}>{organization?.name || "SmartShop"}</h2>}
        <button
          type="button"
          className={styles.collapseBtn1}
          onClick={() => setCollapsed((c) => !c)}
        >
          <FiChevronDown className={collapsed ? styles.rotated : ""} />
        </button>
      </div>

      <nav>
        {/* ================= OWNER ================= */}
        {isOwner && (
          <>
            <NavLink to="/owner/dashboard" end className={linkClass}>
              {!collapsed && <span>Home</span>}
              <FiHome className={styles.icon} />
            </NavLink>

            <NavLink to="/owner/sales" className={linkClass}>
              {!collapsed && <span>View All Sales</span>}
              <FiBarChart2 className={styles.icon} />
            </NavLink>

            {/* STOCK DROPDOWN */}
            <button
              type="button"
              className={`${styles.link} ${isStockRouteActive ? styles.active : ""}`}
              onClick={() => setStockOpen((o) => !o)}
            >
              {!collapsed && <span>Manage Stock</span>}
              {!collapsed && (
                <FiChevronDown
                  className={styles.chevron}
                  style={{ transform: stockOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              )}
              <FiBox className={styles.icon} />
            </button>

            {stockOpen && !collapsed && (
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

            {/* CUSTOMER DROPDOWN */}
            <button
              type="button"
              className={`${styles.link} ${isCustomerRouteActive ? styles.active : ""}`}
              onClick={() => setCustomerOpen((o) => !o)}
            >
              {!collapsed && <span>Manage Customers</span>}
              {!collapsed && (
                <FiChevronDown
                  className={styles.chevron}
                  style={{ transform: customerOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              )}
              <FiUsers className={styles.icon} />
            </button>

            {customerOpen && !collapsed && (
              <div className={styles.subMenu}>
                <NavLink to="/owner/customers/debtors" className={linkClass}>
                  Debtors
                </NavLink>
                <NavLink to="/owner/customers/creditors" className={linkClass}>
                  Creditors
                </NavLink>
                <NavLink to="/owner/customers/add" className={linkClass}>
                  Add Customer
                </NavLink>
              </div>
            )}

            {/* STAFF */}
            <NavLink to="/owner/staff" className={linkClass}>
              {!collapsed && <span>Manage Staff</span>}
              <FiUsers className={styles.icon} />
            </NavLink>

            {/* REPORTS */}
            <NavLink to="/reports" className={linkClass}>
              {!collapsed && <span>Reports</span>}
              <FiFileText className={styles.icon} />
            </NavLink>
          </>
        )}

        {/* ================= STAFF ================= */}
        {isStaff && (
          <>
            <NavLink to="/staff" end className={linkClass}>
              {!collapsed && <span>Dashboard</span>}
              <FiHome className={styles.icon} />
            </NavLink>

            <NavLink to="/staff/profile" className={linkClass}>
              {!collapsed && <span>My Profile</span>}
              <FiUsers className={styles.icon} />
            </NavLink>

            <NavLink to="/staff/password" className={linkClass}>
              {!collapsed && <span>Change Password</span>}
              <FiFileText className={styles.icon} />
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
