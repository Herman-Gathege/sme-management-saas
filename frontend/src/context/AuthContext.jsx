import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, getMe, refreshToken } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // 🔐 LOGIN
  const login = async (credentials) => {
    const data = await loginUser(credentials);

    // store access in memory only
    setAccessToken(data.access_token);

    const me = await getMe(data.access_token);

    setUser(me.user);
    setOrganization(me.organization);
  };

  // 🔐 LOGOUT
  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setAccessToken(null);
    setUser(null);
    setOrganization(null);

    window.location.href = "/login";
  };

  // 🔐 refresh on app start (optional UX improvement)
  useEffect(() => {
    const init = async () => {
      try {
        const data = await refreshToken(); // cookie used
        setAccessToken(data.access_token);

        const me = await getMe(data.access_token);
        setUser(me.user);
        setOrganization(me.organization);
      } catch {
        // not logged in
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        accessToken,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
