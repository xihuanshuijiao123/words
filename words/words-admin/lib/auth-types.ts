export type AdminRole = "system" | "admin";

// 登录会话对应的当前用户信息 (不含密码)
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};
