"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { verifyAccessToken } from "@/lib/auth";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  userId: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token");

      if (token) {
        const payload = await verifyAccessToken(token);
        if (payload) {
          setUserId(payload.userId);
        }
        setIsAuthenticated(!!payload);
      }
    };

    checkAuth();
  }, []);

  const login = async (token: string) => {
    Cookies.set("token", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUserId(null);
    redirect("/signin");
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, userId }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
