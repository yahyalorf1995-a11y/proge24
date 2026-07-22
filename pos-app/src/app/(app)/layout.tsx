import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/db";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Redirects to /login if there's no valid session (see src/proxy.ts
  // for the fast-path redirect; this call is the authoritative check that
  // also gives us the user for the sidebar footer / sign-out button).
  const userId = await getCurrentUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  return (
    <TooltipProvider>
      <SidebarProvider className="h-full min-h-0">
        <AppSidebar userEmail={user?.email ?? ""} userName={user?.name ?? null} />
        <main className="flex-1 min-h-0 overflow-x-hidden w-full relative flex flex-col">
          <header className="flex h-14 shrink-0 items-center gap-4 border-b px-6 bg-background">
            <SidebarTrigger />
            <div className="w-full flex-1 font-semibold text-sm text-muted-foreground">
              مركز القيادة
            </div>
          </header>
          <div className="flex-1 min-h-0 p-6 overflow-y-auto bg-muted/20">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
