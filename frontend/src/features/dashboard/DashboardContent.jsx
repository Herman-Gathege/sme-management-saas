// frontend/src/features/dashboard/DashboardContent.jsx
import { useAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";
import TodaysSales from "../dashboard/widgets/TodaysSales";


export default function DashboardContent({ roleLabel }) {
  const { user, organization } = useAuth();

  if (!user) return null; // or a loading spinner

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.welcome}>
        Welcome, <span>{user.full_name}</span> 👋
      </div>

      <div className={styles.info}>
        <TodaysSales />
      </div>
    </div>
  );
}

