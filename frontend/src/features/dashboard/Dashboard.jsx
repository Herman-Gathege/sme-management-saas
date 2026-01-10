//frontend/src/features/dashboard/Dashboard.jsx

import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "./layout/DashboardLayout";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user, organization } = useAuth();

  return (
    <DashboardLayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.welcome}>
          Welcome, {user.full_name} 👋
        </div>

        <div className={styles.info}>
          <p>
            Organization: <span>{organization.name}</span>
          </p>
          <p>
            Role: <span>{user.role}</span>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
