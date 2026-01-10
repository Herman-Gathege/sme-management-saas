//frontend/src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Dashboard from "../features/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
