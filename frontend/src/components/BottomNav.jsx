import { NavLink } from "react-router-dom";
import {
  FiBarChart2,
  FiBox,
  FiUsers,
  FiFileText,
  FiHome,
} from "react-icons/fi";

export default function BottomNav() {
  return (
    <nav className="bottom-nav hidden-desktop">
      <NavLink to="/owner/dashboard" end className="bottom-nav-item">
        <FiHome />
        <span>Home</span>
      </NavLink>

      <NavLink to="/owner/sales" className="bottom-nav-item">
        <FiBarChart2 />
        <span>Sales</span>
      </NavLink>

      <NavLink to="/owner/suppliers" className="bottom-nav-item">
        <FiUsers />
        <span>Suppliers</span>
      </NavLink>

      <NavLink to="/owner/stock" className="bottom-nav-item">
        <FiBox />
        <span>Stock</span>
      </NavLink>

      <NavLink to="/owner/customers/debtors" className="bottom-nav-item">
        <FiUsers />
        <span>Customers</span>
      </NavLink>

      <NavLink to="/owner/staff" className="bottom-nav-item">
        <FiUsers />
        <span>Staff</span>
      </NavLink>

      <NavLink to="/owner/reports" className="bottom-nav-item">
        <FiFileText />
        <span>Reports</span>
      </NavLink>
    </nav>
  );
}
