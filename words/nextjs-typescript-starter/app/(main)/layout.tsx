import { BottomNav } from "@/components/bottom-nav";

// (main) 路由组：仅首页与我的页面展示底部 Tab
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto min-h-[100dvh] w-full max-w-md bg-gray-50">
      <div className="pb-20 pt-4">{children}</div>
      <BottomNav />
    </div>
  );
}
