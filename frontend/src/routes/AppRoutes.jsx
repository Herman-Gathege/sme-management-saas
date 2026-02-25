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
import OwnerCreditors from "../features/suppliers/OwnerCreditors"; 


// Suppliers
import OwnerSuppliers from "../features/suppliers/OwnerSuppliers";
import OwnerPurchases from "../features/suppliers/OwnerPurchases";

// Staff
import StaffDashboard, {
  StaffSales,
  StaffProfile,
  StaffPassword,
} from "../features/dashboard/StaffDashboard";
import CreateSale from "../features/sales/CreateSale";
import ProtectedRoute from "./ProtectedRoute";
import StaffManagement from "../features/staff/StaffManagement";
import AllCustomers from "../features/customers/AllCustomers";
import Reports from "../features/reports/Reports";

// super admin
import SuperAdminDashboard from "../features/superadmin/SuperAdminDashboard";
import Organizations from "../features/superadmin/Organizations";





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

      {/* ============ Super Admin Layout ============ */}
      <Route
        path="/super-admin/*"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/organizations"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <Organizations />
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
        <Route path="all/customers" element={<AllCustomers />} /> 

        {/* Reports */}
        <Route path="reports" element={<Reports />} />

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

        {/* Suppliers */}
        <Route path="suppliers" element={<OwnerSuppliers />} /> {/* All Suppliers */}
        <Route path="supplier-purchases" element={<OwnerPurchases />} />
        <Route path="suppliers/creditors" element={<OwnerCreditors />} />
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
