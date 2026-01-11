// frontend/src/features/dashboard/OwnerDashboard.jsx
import DashboardLayout from "./layout/DashboardLayout";
import DashboardContent from "./DashboardContent";

export default function OwnerDashboard() {
  return (
    <DashboardLayout>
      <DashboardContent roleLabel="Owner" />
    </DashboardLayout>
  );
}
