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

// Stock (OWNER – layout-based)
import StockLayout from "../features/stock/StockLayout";
import StockList from "../features/stock/StockList";
import AddStock from "../features/stock/AddStock";
import EditStock from "../features/stock/EditStock";

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

      {/* ============ Owner Dashboard ============ */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* ============ Owner: Staff ============ */}
      <Route
        path="/staff/create"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <CreateStaff />
          </ProtectedRoute>
        }
      />

      {/* ============ Owner: Stock (layout + nested) ============ */}
      <Route
        path="/stock/*"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <StockLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StockList />} />   {/* /stock */}
        <Route path="add" element={<AddStock />} /> {/* /stock/add */}
        <Route path=":id/edit" element={<EditStock />} />  {/* /stock/:id/edit */}

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
        <Route index element={<StaffSales />} />     {/* /staff */}
        <Route path="dashboard" element={<StaffSales />} />
        <Route path="profile" element={<StaffProfile />} />
        <Route path="password" element={<StaffPassword />} />
      </Route>
    </Routes>
  );
}
