//frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const res = await getMe();
        setUser(res.user);
        setOrganization(res.organization);
      } catch {
        localStorage.clear();
        setUser(null);
        setOrganization(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);


  return (
    <AuthContext.Provider value={{ user, organization, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
