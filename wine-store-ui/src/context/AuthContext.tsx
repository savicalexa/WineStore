import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api";

type AuthUser = { userId: number | string; email: string; name?: string; role: "Admin" | "Customer" };
type AuthState = { user: AuthUser | null; token: string | null; expiresAt?: string | null };

type Ctx = {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    try { return JSON.parse(localStorage.getItem("auth") || "null") || { user: null, token: null }; }
    catch { return { user: null, token: null }; }
  });

  useEffect(() => { localStorage.setItem("auth", JSON.stringify(state)); }, [state]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/api/Auth/login", { email, password });
    const user: AuthUser = { userId: data.userId, email: data.email, name: data.name, role: data.role };
    setState({ user, token: data.token, expiresAt: data.expiresAt });
  };

  const logout = () => { setState({ user: null, token: null, expiresAt: null }); localStorage.removeItem("auth"); };

  const value = useMemo<Ctx>(() => ({
    user: state.user, token: state.token, login, logout, isAdmin: state.user?.role === "Admin"
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){ const ctx = useContext(AuthContext); if(!ctx) throw new Error("useAuth must be used within AuthProvider"); return ctx; }

// Guards
import { Navigate, Outlet } from "react-router-dom";
export function RequireAdmin(){
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/login" replace />;
  return <Outlet />;
}
