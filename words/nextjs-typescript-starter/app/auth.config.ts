import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // 仅对 /protected 等受保护页面做鉴权；其余页面（首页/学习页/详情页等）允许访问，
      // 登录态由前端 mock 的 AuthProvider 管理，避免路由被强制重定向。
      let isOnDashboard = nextUrl.pathname.startsWith('/protected');

      if (isOnDashboard) {
        return !!auth?.user; // 未登录重定向到登录页
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
