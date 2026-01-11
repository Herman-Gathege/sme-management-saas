// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // waiting for /auth/me

  if (!user) return <Navigate to="/login" replace />; // not logged in

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // user logged in but role not allowed
    return <div className="text-center p-10">You don’t have access to this page</div>;
  }

  return children;
};

export default ProtectedRoute;
