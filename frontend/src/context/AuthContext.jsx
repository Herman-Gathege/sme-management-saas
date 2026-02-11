//frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setOrganization(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    getMe()
      .then((res) => {
        setUser(res.user);
        setOrganization(res.organization);
      })
      .catch(() => {
        // not logged in — just ignore
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, organization, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
