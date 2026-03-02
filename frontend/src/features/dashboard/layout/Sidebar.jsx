//frontend/src/features/dashboard/layout/Sidebar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiHome,
  FiBarChart2,
  FiBox,
  FiUsers,
  FiFileText,
  FiSettings,
} from "react-icons/fi";

export default function Sidebar() {
  const { user, organization } = useAuth();
  const location = useLocation();

  // ---------------------------
  // Dropdown state
  // ---------------------------
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true"; // default false if null
  });
  const [stockOpen, setStockOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);

  // ---------------------------
  // Role flags
  // ---------------------------
  const isOwner = user?.role === "owner";
  const isStaff = user?.role === "staff";  
  const isSuperAdmin = user?.role === "super_admin";

  // ---------------------------
  // Routes
  // ---------------------------
  const stockRoutes = [
    "/owner/stock",
    "/owner/stock/add",
    "/owner/stock/history",
  ];

  const customerRoutes = [
    "/owner/customers/debtors",
    "/owner/customers/creditors",
    "/owner/customers/add",
    "/owner/all/customers",
  ];

  const supplierRoutes = [
    "/owner/suppliers",
    "/owner/supplier-purchases",
    "/owner/supplier-payments",
  ];

  const isStockRouteActive = stockRoutes.some((path) =>
    location.pathname.startsWith(path),
  );

  const isCustomerRouteActive = customerRoutes.some((path) =>
    location.pathname.startsWith(path),
  );

  const isSupplierRouteActive = supplierRoutes.some((path) =>
    location.pathname.startsWith(path),
  );

  // ---------------------------
  // Open dropdowns if route is active
  // ---------------------------
  useEffect(() => {
    if (isStockRouteActive) setStockOpen(true);
    if (isCustomerRouteActive) setCustomerOpen(true);
    if (isSupplierRouteActive) setSupplierOpen(true);
  }, [isStockRouteActive, isCustomerRouteActive, isSupplierRouteActive]);

  /* 🔥 IMPORTANT FIX */
  useEffect(() => {
    if (collapsed) {
      setStockOpen(false);
      setCustomerOpen(false);
      setSupplierOpen(false);
    }
  }, [collapsed]);

  useEffect(() => {
  localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);


  if (!user) return null;

  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <aside
      className={`sidebar hidden-mobile ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* ================= HEADER ================= */}
      <div className="sidebar-header">
        {!collapsed && (
          <h2 className="sidebar-logo text-lg font-bold company-blue">
            {organization?.name || "Azani SmartDuka"}
          </h2>
        )}

        {/* Collapse button with < or > */}
        <button
          type="button"
          className="sidebar-collapse-btn mr-sm"
          onClick={() => setCollapsed((c) => !c)}
        >
          <FiChevronDown className={collapsed ? "rotated" : ""} />
        </button>
      </div>

      {/* ================= NAV ================= */}
      <nav className="sidebar-nav flex flex-col gap-sm p-sm">
        {/* ================= OWNER ================= */}
        {isOwner && (
          <>
            <NavLink to="/owner/dashboard" end className={linkClass}>
              <FiHome />
              {!collapsed && <span>Home</span>}
            </NavLink>

            <NavLink to="/owner/sales" className={linkClass}>
              <FiBarChart2 />
              {!collapsed && <span>View All Sales</span>}
            </NavLink>

            {/* -------- SUPPLIERS -------- */}
            <button
              type="button"
              className={`sidebar-link ${
                isSupplierRouteActive ? "active" : ""
              }`}
              onClick={() => setSupplierOpen((o) => !o)}
            >
              <FiUsers />
              {!collapsed && <span>Suppliers</span>}
              {!collapsed && (
                <FiChevronDown
                  className={`chevron ${supplierOpen ? "rotated" : ""}`}
                />
              )}
            </button>

            {supplierOpen && !collapsed && (
              <div className="sidebar-submenu">
                <NavLink to="/owner/suppliers" className={linkClass}>
                  Supplier List
                </NavLink>
                <NavLink to="/owner/supplier-purchases" className={linkClass}>
                  Supplier Purchases
                </NavLink>
                <NavLink to="/owner/suppliers/creditors" className={linkClass}>
                  I owe them
                </NavLink>
              </div>
            )}

            {/* -------- STOCK -------- */}
            <button
              type="button"
              className={`sidebar-link ${isStockRouteActive ? "active" : ""}`}
              onClick={() => setStockOpen((o) => !o)}
            >
              <FiBox />
              {!collapsed && <span>Manage Stock</span>}
              {!collapsed && (
                <FiChevronDown
                  className={`chevron ${stockOpen ? "rotated" : ""}`}
                />
              )}
            </button>

            {stockOpen && !collapsed && (
              <div className="sidebar-submenu">
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

            {/* -------- CUSTOMERS -------- */}
            <button
              type="button"
              className={`sidebar-link ${
                isCustomerRouteActive ? "active" : ""
              }`}
              onClick={() => setCustomerOpen((o) => !o)}
            >
              <FiUsers />
              {!collapsed && <span>Customers</span>}
              {!collapsed && (
                <FiChevronDown
                  className={`chevron ${customerOpen ? "rotated" : ""}`}
                />
              )}
            </button>

            {customerOpen && !collapsed && (
              <div className="sidebar-submenu">
                <NavLink to="/owner/customers/debtors" className={linkClass}>
                  They owe me
                </NavLink>
                <NavLink to="/owner/customers/add" className={linkClass}>
                  Add Customer
                </NavLink>
                <NavLink to="/owner/all/customers" className={linkClass}>
                  Customers List
                </NavLink>
              </div>
            )}

            <NavLink to="/owner/staff" className={linkClass}>
              <FiUsers />
              {!collapsed && <span>Manage Staff</span>}
            </NavLink>

            <NavLink to="/owner/reports" className={linkClass}>
              <FiFileText />
              {!collapsed && <span>Reports</span>}
            </NavLink>

            <NavLink to="/owner/settings" className={linkClass}>
              <FiSettings />
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </>
        )}

        {/* ================= STAFF ================= */}
        {isStaff && (
          <>
            <NavLink to="/staff" end className={linkClass}>
              <FiHome />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            <NavLink to="/staff/profile" className={linkClass}>
              <FiUsers />
              {!collapsed && <span>My Profile</span>}
            </NavLink>

            <NavLink to="/staff/password" className={linkClass}>
              <FiFileText />
              {!collapsed && <span>Change Password</span>}
            </NavLink>
          </>
        )}

        {/* ================= SUPER ADMIN ================= */}
        {isSuperAdmin && (
          <>
            <NavLink to="/super-admin/dashboard" end className={linkClass}>
              <FiHome />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            <NavLink to="/super-admin/organizations" className={linkClass}>
              <FiUsers />
              {!collapsed && <span>Organizations</span>}
            </NavLink>

            <NavLink to="/super-admin/reports" className={linkClass}>
              <FiFileText />
              {!collapsed && <span>System Reports</span>}
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
