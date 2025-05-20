import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api";

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            "x-auth-token": token,
          },
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Failed to load user:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [API_URL]);

  const register = async (userData) => {
    try {
      setError(null);
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      localStorage.setItem("token", res.data.token);
      const userRes = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          "x-auth-token": res.data.token,
        },
      });
      setCurrentUser(userRes.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
      return false;
    }
  };

  const login = async (userData) => {
    try {
      setError(null);
      const res = await axios.post(`${API_URL}/auth/login`, userData);
      localStorage.setItem("token", res.data.token);
      const userRes = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          "x-auth-token": res.data.token,
        },
      });
      setCurrentUser(userRes.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
