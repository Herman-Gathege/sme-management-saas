//frontend/src/features/dashboard/DashboardDecision.jsx
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardDecision() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      // Redirect based on role
      if (user.role === "owner") {
        navigate("/owner/dashboard", { replace: true });
      } else if (user.role === "staff") {
        navigate("/staff/dashboard", { replace: true });
      } else {
        // Unknown role fallback
        navigate("/login", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return <p>Loading dashboard...</p>;
}
