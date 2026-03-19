import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser } from "../api/authApi";

const AuthContext = createContext();

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===== Check if user already logged in ===== */

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /* ===== Login Function ===== */

  const login = async (data) => {
    const res = await loginUser(data);
    setUser(res.user);
    return res;
  };

  /* ===== Logout Function ===== */

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= CUSTOM HOOK ================= */

export const useAuth = () => {
  return useContext(AuthContext);
};