"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

type Mode = "login" | "register";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthDialog() {
  const router = useRouter();
  const {
    authOpen,
    closeAuth,
    signin,
    signup,
    isReady,
    pendingBook,
    setPendingBook,
  } = useAuth();

  const [mode, setMode] = React.useState<Mode>("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!authOpen) {
      // 关闭时重置
      setError(null);
      setSubmitting(false);
    } else {
      setMode("login");
      setError(null);
    }
  }, [authOpen]);

  const submit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!EMAIL_RE.test(email.trim())) {
        setError("请输入正确的邮箱格式");
        return;
      }
      if (password.length < 6) {
        setError("密码至少 6 位");
        return;
      }
      if (mode === "register") {
        if (!name.trim()) {
          setError("请输入姓名");
          return;
        }
        if (password !== confirm) {
          setError("两次输入的密码不一致");
          return;
        }
      }

      setSubmitting(true);
      const result =
        mode === "login"
          ? await signin({ email: email.trim(), password })
          : await signup({ name: name.trim(), email: email.trim(), password });

      setSubmitting(false);

      if (!result.ok) {
        setError(result.error ?? "操作失败，请重试");
        return;
      }

      const target = pendingBook;
      setPendingBook(null);
      closeAuth();
      if (target) {
        router.push(`/learn/${target}`);
      } else {
        router.push("/profile");
      }
    },
    [mode, email, password, confirm, name, pendingBook, signin, signup, closeAuth, setPendingBook, router]
  );

  if (!authOpen || !isReady) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !submitting && closeAuth()}
      />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 px-6 py-6 text-center text-white">
          <h2 className="text-xl font-bold">学英语单词</h2>
          <p className="mt-1 text-sm text-white/85">
            {mode === "login" ? "登录以继续学习" : "创建你的账号"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4 px-6 py-6">
          {mode === "register" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                姓名
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入姓名"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                确认密码
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="再次输入密码"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            {submitting ? "请稍候…" : mode === "login" ? "登录" : "注册"}
          </button>

          <div className="text-center text-sm text-gray-500">
            {mode === "login" ? (
              <>
                没有账号？
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="ml-1 font-semibold text-primary-600"
                >
                  去注册
                </button>
              </>
            ) : (
              <>
                已有账号？
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="ml-1 font-semibold text-primary-600"
                >
                  去登录
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
