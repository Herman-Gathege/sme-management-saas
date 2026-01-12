//frontend/src/features/stock/StockLayout.jsx
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { Outlet } from "react-router-dom";

export default function StockLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
