// frontend/src/routes/AppRoutes.jsx
import { Routes, Route, Outlet } from "react-router-dom";
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
import AllSales from "../features/sales/AllSales";
import OwnerCustomers from "../features/customers/OwnerCustomers";
import CreateCustomer from "../features/customers/CreateCustomer";

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

      {/* ============ Owner Layout ============ */}
      <Route path="/owner/*" element={<DashboardLayout />}>
        {/* Dashboard */}
        <Route index element={<OwnerDashboard />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="sales" element={<AllSales />} />

        {/* Customers */}
        <Route path="customers" element={<OwnerCustomers />} /> {/* All Customers */}
        <Route path="customers/debtors" element={<OwnerCustomers type="debtor" />} />
        <Route path="customers/creditors" element={<OwnerCustomers type="creditor" />} />
        <Route path="customers/add" element={<CreateCustomer />} />

        {/* Staff */}
        <Route path="staff/create" element={<CreateStaff />} />
        <Route path="staff" element={<StaffManagement />} />

        {/* Stock */}
        <Route path="stock" element={<Outlet />}>
          <Route index element={<StockList />} />
          <Route path="add" element={<AddStock />} />
          <Route path=":id/edit" element={<EditStock />} />
          <Route path="history" element={<StockHistory />} />
        </Route>
      </Route>

      {/* ============ Staff Layout ============ */}
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<CreateSale />} />
        <Route path="dashboard" element={<CreateSale />} />
        <Route path="profile" element={<StaffProfile />} />
        <Route path="password" element={<StaffPassword />} />
      </Route>
    </Routes>
  );
}
