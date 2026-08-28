"use client";

import * as React from "react";

import { mockUsers } from "@/lib/mock-data";
import type { MockUser } from "@/lib/types";

type AuthResult = { ok: boolean; error?: string };

type AuthContextValue = {
  user: MockUser | null;
  isReady: boolean;
  hasAdmin: boolean;
  signin: (input: { email: string; password: string }) => Promise<AuthResult>;
  signup: (input: { name: string; email: string; password: string }) => Promise<AuthResult>;
  signout: () => void;
  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  pendingBook: string | null;
  setPendingBook: (bookId: string | null) => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth 必须在 <AuthProvider> 内使用");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // mock：默认已登录，便于演示「最近学习」；退出登录后可体验未登录状态
  const [user, setUser] = React.useState<MockUser | null>(mockUsers[0] ?? null);
  const [ready, setReady] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [pendingBook, setPendingBook] = React.useState<string | null>(null);

  React.useEffect(() => {
    setReady(true);
  }, []);

  const signin = React.useCallback(async ({ email, password }: { email: string; password: string }) => {
    await new Promise((r) => setTimeout(r, 400)); // 模拟网络延迟
    const found = mockUsers.find((u) => u.email === email);
    if (!found) {
      // mock：自动创建一个新账号便于体验
      const created: MockUser = { id: `u-${Date.now()}`, name: email.split("@")[0], email, role: "admin" };
      mockUsers.push({ ...created, password });
      setUser(created);
      return { ok: true };
    }
    if (found.password !== password) {
      return { ok: false, error: "邮箱或密码错误" };
    }
    setUser({ id: found.id, name: found.name, email: found.email, role: found.role });
    return { ok: true };
  }, []);

  const signup = React.useCallback(async ({ name, email, password }: { name: string; email: string; password: string }) => {
    await new Promise((r) => setTimeout(r, 400));
    if (mockUsers.some((u) => u.email === email)) {
      return { ok: false, error: "该邮箱已被注册" };
    }
    const created: MockUser = { id: `u-${Date.now()}`, name, email, role: "admin" };
    mockUsers.push({ ...created, password });
    setUser(created);
    return { ok: true };
  }, []);

  const signout = React.useCallback(() => {
    setUser(null);
    setPendingBook(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isReady: ready,
    hasAdmin: mockUsers.length > 0,
    signin,
    signup,
    signout,
    authOpen,
    openAuth: () => setAuthOpen(true),
    closeAuth: () => setAuthOpen(false),
    pendingBook,
    setPendingBook,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
