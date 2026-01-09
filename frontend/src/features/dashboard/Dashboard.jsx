import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "./layout/DashboardLayout";

export default function Dashboard() {
  const { user, organization } = useAuth();

  return (
    <DashboardLayout>
      <h1>Welcome, {user.full_name} 👋</h1>
      <p><strong>Organization:</strong> {organization.name}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </DashboardLayout>
  );
}
