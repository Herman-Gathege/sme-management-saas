// import { NavLink } from "react-router-dom";
// import {
//   FiBarChart2,
//   FiBox,
//   FiUsers,
//   FiFileText,
//   // FiHome,
// } from "react-icons/fi";

// export default function BottomNav() {
//   return (
//     <nav className="bottom-nav hidden-desktop">
//       {/* <NavLink to="/owner/dashboard" end className="bottom-nav-item">
//         <FiHome />
//         <span>Home</span>
//       </NavLink> */}

//       <NavLink to="/owner/sales" className="bottom-nav-item">
//         <FiBarChart2 />
//         <span>Sales</span>
//       </NavLink>

//       <NavLink to="/owner/suppliers" className="bottom-nav-item">
//         <FiUsers />
//         <span>Suppliers</span>
//       </NavLink>

//       <NavLink to="/owner/stock" className="bottom-nav-item">
//         <FiBox />
//         <span>Stock</span>
//       </NavLink>

//       <NavLink to="/owner/customers/debtors" className="bottom-nav-item">
//         <FiUsers />
//         <span>Customers</span>
//       </NavLink>

//       <NavLink to="/owner/staff" className="bottom-nav-item">
//         <FiUsers />
//         <span>Staff</span>
//       </NavLink>

//       <NavLink to="/owner/reports" className="bottom-nav-item">
//         <FiFileText />
//         <span>Reports</span>
//       </NavLink>
//     </nav>
//   );
// }


import { NavLink } from "react-router-dom";
import {
  FiBarChart2,
  FiBox,
  FiUsers,
  FiMenu,
  FiHome
} from "react-icons/fi";
import { useState } from "react";

export default function BottomNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="bottom-nav hidden-desktop">

        <NavLink to="/owner/dashboard" end className="bottom-nav-item">
         <FiHome />
         <span>Home</span>
       </NavLink>

        <NavLink to="/owner/sales" className="bottom-nav-item">
          <FiBarChart2 />
          <span>Sales</span>
        </NavLink>

        <NavLink to="/owner/stock" className="bottom-nav-item">
          <FiBox />
          <span>Stock</span>
        </NavLink>

        <NavLink to="/owner/customers/debtors" className="bottom-nav-item">
          <FiUsers />
          <span>Customers</span>
        </NavLink>

        {/* MORE BUTTON */}
        {/* <button
          className="bottom-nav-item"
          onClick={() => setOpen(true)}
        >
          <FiMenu />
          <span>More</span>
        </button> */}

      </nav>

      {/* MORE MENU
      {open && (
        <div className="mobile-more-overlay" onClick={() => setOpen(false)}>
          <div
            className="mobile-more-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <NavLink to="/owner/suppliers">Suppliers</NavLink>
            <NavLink to="/owner/staff">Staff</NavLink>
            <NavLink to="/owner/reports">Reports</NavLink>

            <button onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )} */}
    </>
  );
}
