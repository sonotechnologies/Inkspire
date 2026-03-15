import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API = "https://inkspire-api-9xkt.onrender.com";

/*
=========================
AXIOS INSTANCE
=========================
*/

export const api = axios.create({
  baseURL: API
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("inkspire-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  /*
  =========================
  LOAD USER FROM DATABASE
  =========================
  */

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");

      setUser(res.data.user);

    } catch (err) {

      localStorage.removeItem("inkspire-token");
      setUser(null);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  /*
  =========================
  REGISTER USER
  =========================
  */

  const register = async (name, email, password) => {
    try {

      const res = await api.post("/auth/register", {
        name,
        email,
        password
      });

      const { token, user } = res.data;

      localStorage.setItem("inkspire-token", token);

      setUser(user);

      return true;

    } catch (err) {
      console.error("Register failed", err);
      return false;
    }
  };

  /*
  =========================
  LOGIN USER
  =========================
  */

  const login = async (email, password) => {
    try {

      const res = await api.post("/auth/login", {
        email,
        password
      });

      const { token, user } = res.data;

      localStorage.setItem("inkspire-token", token);

      setUser(user);

      return true;

    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  /*
  =========================
  LOGOUT
  =========================
  */

  const logout = () => {

    localStorage.removeItem("inkspire-token");

    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        isAuthenticated,
        loading,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);