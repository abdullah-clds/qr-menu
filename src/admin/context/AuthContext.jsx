import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, setCsrfToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState("checking"); // checking | ready

  useEffect(() => {
    api
      .get("auth/me")
      .then((data) => {
        setAdmin(data.admin);
        setCsrfToken(data.csrfToken);
      })
      .catch(() => setAdmin(null))
      .finally(() => setStatus("ready"));
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await api.post("auth/login", { username, password });
    setAdmin(data.admin);
    setCsrfToken(data.csrfToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("auth/logout");
    } finally {
      setAdmin(null);
      setCsrfToken(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ admin, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
