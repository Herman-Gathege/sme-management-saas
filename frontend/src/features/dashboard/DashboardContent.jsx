// frontend/src/features/dashboard/DashboardContent.jsx
import { useAuth } from "../../context/AuthContext";
import TodaysSales from "../dashboard/widgets/TodaysSales";
import StockAlerts from "../dashboard/widgets/StockAlerts";
import TodaysCreditSales from "./widgets/TodaysCreditSales";



export default function DashboardContent({ roleLabel }) {
  const { user, organization } = useAuth();

  if (!user) return null; // or a loading spinner

  return (
    <div className="p-6">
      <div className="text-lg font-bold mb-md">
        Welcome, <span>{user.full_name}</span> 👋
      </div>

      <div className="grid grid-cols-1 grid-cols-3 gap-md">
      <StockAlerts />
      <TodaysSales />
      <TodaysCreditSales />
    </div>
    </div>
  );
}

