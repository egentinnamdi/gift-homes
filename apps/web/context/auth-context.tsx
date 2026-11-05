"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, AuthContextType, AuthResult } from "@/types/auth";
import { api, getToken, setToken } from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore the session from the stored token
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await api.me();
        if (!cancelled) setUser(me as User);
      } catch {
        setToken(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const finish = useCallback((data: { user: User; token: string }): AuthResult => {
    setToken(data.token);
    setUser(data.user);
    return { ok: true, user: data.user };
  }, []);

  const login: AuthContextType["login"] = async (email, password) => {
    try {
      return finish((await api.login(email, password)) as { user: User; token: string });
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Sign in failed" };
    }
  };

  const register: AuthContextType["register"] = async (data) => {
    try {
      return finish((await api.register(data)) as { user: User; token: string });
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Registration failed" };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
