//frontend/src/features/dashboard/layout/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BottomNav from "../../../components/BottomNav";

// import styles from "./DashboardLayout.module.css";

export default function DashboardLayout() {
  // return (
  //   <div className={styles.layout}>
  //     <Sidebar />

  //     <div className={styles.main}>
  //       <Navbar />
  //       <div className={styles.content}>
  //         <Outlet />
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />
        <main className="dashboard-content">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
