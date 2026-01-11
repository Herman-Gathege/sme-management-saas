// frontend/src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import DashboardDecision from "../features/dashboard/DashboardDecision";
import OwnerDashboard from "../features/dashboard/OwnerDashboard";
import StaffDashboard, {
  StaffSales,
  StaffProfile,
  StaffPassword,
} from "../features/dashboard/StaffDashboard";
import CreateStaff from "../features/staff/CreateStaff";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Role-based dashboard redirect */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardDecision />
          </ProtectedRoute>
        }
      />

      {/* Owner dashboard */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Staff dashboard with nested routes */}
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffSales />} />          {/* /staff */}
        <Route path="dashboard" element={<StaffSales />} />
        <Route path="profile" element={<StaffProfile />} />
        <Route path="password" element={<StaffPassword />} />
      </Route>

      {/* Create staff (only owner) */}
      <Route
        path="/staff/create"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <CreateStaff />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
