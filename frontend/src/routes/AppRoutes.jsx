// frontend/src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import DashboardDecision from "../features/dashboard/DashboardDecision";

// Owner
import DashboardLayout from "../features/dashboard/layout/DashboardLayout";
import OwnerDashboard from "../features/dashboard/OwnerDashboard";
import CreateStaff from "../features/staff/CreateStaff";
import StockList from "../features/stock/StockList";
import AddStock from "../features/stock/AddStock";
import EditStock from "../features/stock/EditStock";
import StockHistory from "../features/stock/StockHistory";
import { Outlet } from "react-router-dom";

// Staff
import StaffDashboard, {
  StaffSales,
  StaffProfile,
  StaffPassword,
} from "../features/dashboard/StaffDashboard";
import CreateSale from "../features/sales/CreateSale";

import ProtectedRoute from "./ProtectedRoute";
import StaffManagement from "../features/staff/StaffManagement";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= Public ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ============ Role Decision ============ */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardDecision />
          </ProtectedRoute>
        }
      />

      {/* ============ Owner Layout (Dashboard + Staff + Stock) ============ */}
      <Route path="/owner/*" element={<DashboardLayout />}>
        {/* Dashboard */}
        <Route index element={<OwnerDashboard />} />
        <Route path="dashboard" element={<OwnerDashboard />} />

        {/* Staff */}
        <Route path="staff/create" element={<CreateStaff />} />
        <Route path="staff" element={<StaffManagement />} />

        {/* Stock - Nested */}
        <Route path="stock" element={<Outlet />}>
          <Route index element={<StockList />} /> // /owner/stock
          <Route path="add" element={<AddStock />} /> // /owner/stock/add
          <Route path=":id/edit" element={<EditStock />} /> //
          /owner/stock/7/edit
          <Route path="history" element={<StockHistory />} />
          // /owner/stock/history
        </Route>
      </Route>

      {/* ============ Staff Dashboard ============ */}
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<CreateSale />} /> {/* default /staff */}
        <Route path="dashboard" element={<CreateSale />} />{" "}
        {/* /staff/dashboard */}
        <Route path="profile" element={<StaffProfile />} />
        <Route path="password" element={<StaffPassword />} />
      </Route>
    </Routes>
  );
}
