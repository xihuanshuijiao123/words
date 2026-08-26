"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  BookOpenIcon,
  LogOutIcon,
  UsersIcon,
  BookOpenTextIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signout } = useAuth();

  async function handleSignout() {
    await signout();
    router.replace("/signin");
  }

  // 仅系统管理员可见"管理员管理"入口
  const isSystemAdmin = user?.role === "system";
  const navItems = [
    {
      title: "单词书管理",
      href: "/books",
      icon: BookOpenIcon,
    },
    ...(isSystemAdmin
      ? [{ title: "管理员管理", href: "/admin-users", icon: UsersIcon }]
      : []),
  ];

  const initials = React.useMemo(() => {
    if (!user?.name) return "A";
    return user.name.trim().slice(0, 1).toUpperCase();
  }, [user?.name]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="单词管理后台"
              size="lg"
              className="gap-3"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpenTextIcon className="size-4" />
              </div>
              <span className="font-semibold">单词管理后台</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>菜单</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <div className="flex items-center gap-3 p-2">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleSignout}
            aria-label="退出登录"
            title="退出登录"
          >
            <LogOutIcon />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
