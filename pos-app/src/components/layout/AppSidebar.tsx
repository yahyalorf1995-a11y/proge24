"use client";

import {
  Home,
  Target,
  LayoutList,
  CheckCircle,
  Repeat,
  FolderKanban,
  Settings,
  BookOpen,
  LineChart,
  SearchCheck,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logOut } from "@/features/auth/actions";

// Grouping navigation items for better UX
const navGroups = [
  {
    label: "مركز القيادة",
    items: [
      { title: "لوحة التحكم", url: "/", icon: Home },
    ],
  },
  {
    label: "الاستراتيجية (التخطيط)",
    items: [
      { title: "الهوية", url: "/identity", icon: Target },
      { title: "الدستور", url: "/constitution", icon: BookOpen },
      { title: "الرؤية", url: "/vision", icon: Target },
      { title: "مجالات الحياة", url: "/life-areas", icon: LayoutList },
      { title: "الأهداف", url: "/goals", icon: Target },
    ],
  },
  {
    label: "التنفيذ (العمل)",
    items: [
      { title: "المشاريع", url: "/projects", icon: FolderKanban },
      { title: "المهام", url: "/tasks", icon: CheckCircle },
      { title: "العادات", url: "/habits", icon: Repeat },
    ],
  },
  {
    label: "المتابعة (المراجعة)",
    items: [
      { title: "اليوميات", url: "/journal", icon: BookOpen },
      { title: "المراجعات", url: "/reviews", icon: SearchCheck },
      { title: "التحليلات", url: "/analytics", icon: LineChart },
    ],
  },
];

export function AppSidebar({
  userEmail,
  userName,
}: {
  userEmail: string;
  userName: string | null;
}) {
  const pathname = usePathname();
  const displayName = userName || userEmail || "الحساب";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "شخ";

  return (
    <Sidebar variant="sidebar" collapsible="icon" side="right">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <span className="font-bold">نظ</span>
          </div>
          <span className="font-bold text-lg tracking-tight truncate group-data-[collapsible=icon]:hidden">
            نظامي الشخصي
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/");

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={isActive} tooltip={item.title}>
                        <Link href={item.url} className="flex items-center gap-2 w-full h-full">
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="الإعدادات">
              <Link href="/settings" className="flex items-center gap-2 w-full h-full">
                <Settings className="h-4 w-4 shrink-0" />
                <span className="truncate">الإعدادات</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2 w-full mt-2 overflow-hidden bg-muted/50 rounded-lg">
              <Avatar className="h-8 w-8 rounded-md shrink-0 border border-background">
                <AvatarFallback className="rounded-md bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 group-data-[collapsible=icon]:hidden truncate">
                <span className="text-sm font-medium leading-none truncate">{displayName}</span>
                <span className="text-[10px] text-muted-foreground mt-1 truncate">{userEmail}</span>
              </div>
              <form action={logOut} className="group-data-[collapsible=icon]:hidden">
                <button
                  type="submit"
                  aria-label="تسجيل الخروج"
                  title="تسجيل الخروج"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
