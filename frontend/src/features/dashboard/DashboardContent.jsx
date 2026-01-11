// frontend/src/features/dashboard/DashboardContent.jsx
import { useAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";

export default function DashboardContent({ roleLabel }) {
  const { user, organization } = useAuth();

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.welcome}>
        Welcome, {user.full_name} 👋
      </div>

      <div className={styles.info}>
        <p>
          Organization: <span>{organization.name}</span>
        </p>
        <p>
          Role: <span>{roleLabel}</span>
        </p>
      </div>
    </div>
  );
}
