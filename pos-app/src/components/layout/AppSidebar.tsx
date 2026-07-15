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

// Grouping navigation items for better UX
const navGroups = [
  {
    label: "Command Center",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
    ],
  },
  {
    label: "Strategy (Planning)",
    items: [
      { title: "Identity", url: "/identity", icon: Target },
      { title: "Constitution", url: "/constitution", icon: BookOpen },
      { title: "Vision", url: "/vision", icon: Target },
      { title: "Life Areas", url: "/life-areas", icon: LayoutList },
      { title: "Goals", url: "/goals", icon: Target },
    ],
  },
  {
    label: "Execution (Doing)",
    items: [
      { title: "Projects", url: "/projects", icon: FolderKanban },
      { title: "Tasks", url: "/tasks", icon: CheckCircle },
      { title: "Habits", url: "/habits", icon: Repeat },
    ],
  },
  {
    label: "Tracking (Reviewing)",
    items: [
      { title: "Journal", url: "/journal", icon: BookOpen },
      { title: "Reviews", url: "/reviews", icon: SearchCheck },
      { title: "Analytics", url: "/analytics", icon: LineChart }, // Placeholder
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r-border/40">
      <SidebarHeader className="p-5 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background shrink-0 shadow-sm">
            <span className="font-bold text-xs">OS</span>
          </div>
          <span className="font-semibold text-sm tracking-tight truncate group-data-[collapsible=icon]:hidden">
            Personal OS
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3 gap-0">
        {navGroups.map((group, index) => (
          <SidebarGroup key={index} className="pt-2">
            <SidebarGroupLabel className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase px-2 mb-1">{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/");
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={isActive} tooltip={item.title} className={`rounded-lg h-9 transition-all duration-200 ${isActive ? 'bg-primary/5 text-primary font-medium shadow-sm' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <Link href={item.url} className="flex items-center gap-2.5 w-full h-full">
                          <item.icon className={`h-4 w-4 shrink-0 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground/70'}`} />
                          <span className="truncate text-sm">{item.title}</span>
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

      <SidebarFooter className="p-4 border-t border-border/40 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings" className="rounded-lg h-9 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200">
              <Link href="/settings" className="flex items-center gap-2.5 w-full h-full">
                <Settings className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                <span className="truncate text-sm">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2 w-full mt-2 overflow-hidden bg-transparent hover:bg-muted/30 transition-colors rounded-lg cursor-pointer">
              <Avatar className="h-7 w-7 rounded-md shrink-0 shadow-sm">
                <AvatarFallback className="rounded-md bg-primary/10 text-primary font-semibold text-[10px]">US</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 group-data-[collapsible=icon]:hidden truncate">
                <span className="text-sm font-medium leading-none truncate text-foreground/90">User</span>
                <span className="text-[10px] text-muted-foreground mt-1 truncate">Free Plan</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}