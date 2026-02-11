import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBarChart2,
  FiBox,
  FiUsers,
  FiFileText
} from "react-icons/fi";

export default function BottomNav() {

  const linkClass = ({ isActive }) =>
    `bottom-nav-item ${isActive ? "active" : ""}`;

  return (
    <nav className="bottom-nav hidden-desktop">

      <NavLink to="/owner/dashboard" end className={linkClass}>
        <FiHome />
        <span>Home</span>
      </NavLink>

      <NavLink to="/owner/sales" className={linkClass}>
        <FiBarChart2 />
        <span>Sales</span>
      </NavLink>

      <NavLink to="/owner/stock" className={linkClass}>
        <FiBox />
        <span>Stock</span>
      </NavLink>

      <NavLink to="/owner/customers/debtors" className={linkClass}>
        <FiUsers />
        <span>Customers</span>
      </NavLink>

      <NavLink to="/owner/Reports" className={linkClass}>
        <FiFileText />
        <span>Reports</span>
      </NavLink>

      {/* Open sidebar
      <button className="bottom-nav-item nav-more">
        <FiMenu />
        <span>More</span>
      </button> */}

    </nav>
  );
}
