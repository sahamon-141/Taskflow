import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple JWT decoder helper to extract info from the access token
function decodeToken(token: string): { email?: string; name?: string } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const accessToken = localStorage.getItem("taskflow_access_token");
    if (accessToken) {
      const decoded = decodeToken(accessToken);
      const email = decoded?.email || localStorage.getItem("taskflow_user_email") || "user@example.com";
      const name = decoded?.name || localStorage.getItem("taskflow_user_name") || email.split("@")[0];
      setUser({ email, name });
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("taskflow_access_token", accessToken);
      localStorage.setItem("taskflow_refresh_token", refreshToken);
      localStorage.setItem("taskflow_user_email", email);

      const decoded = decodeToken(accessToken);
      const name = decoded?.name || email.split("@")[0];
      localStorage.setItem("taskflow_user_name", name);

      setUser({ email, name });
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        name,
        email,
        password,
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("taskflow_access_token");
    localStorage.removeItem("taskflow_refresh_token");
    localStorage.removeItem("taskflow_user_email");
    localStorage.removeItem("taskflow_user_name");
    setUser(null);
    setIsAuthenticated(false);
  };

  const logout = async () => {
    setLoading(true);
    const refreshToken = localStorage.getItem("taskflow_refresh_token");
    try {
      if (refreshToken) {
        await axios.post("http://localhost:8080/api/auth/logout", {
          refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearAuth();
      setLoading(false);
      // Redirect to landing page
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
