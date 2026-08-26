import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 让 next 在服务端不打进 pg，避免 node 内置模块打包报错
  serverExternalPackages: ["pg"],
};

export default nextConfig;
