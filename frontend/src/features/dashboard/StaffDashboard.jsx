import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "./layout/DashboardLayout";
import styles from "./Dashboard.module.css";

export default function StaffDashboard() {
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

        {/* Staff-specific sections */}
        <div className={styles.staffTasks}>
          <h3>Your Tasks</h3>
          <ul>
            <li>View Sales</li>
            <li>View Stock</li>
            {/* Add any other staff-specific items */}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
