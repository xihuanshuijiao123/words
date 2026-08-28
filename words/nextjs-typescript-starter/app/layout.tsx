import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { AuthProvider } from "@/components/auth-provider";
import { AuthDialog } from "@/components/auth-dialog";

export const metadata = {
  title: "学英语单词 · H5",
  description: "卡片式背单词应用，随手学、随时记。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${GeistSans.variable} bg-gray-100 antialiased`}>
        <AuthProvider>
          {children}
          <AuthDialog />
        </AuthProvider>
      </body>
    </html>
  );
}
