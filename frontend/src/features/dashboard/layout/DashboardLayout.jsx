import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.main}>
        <Navbar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
