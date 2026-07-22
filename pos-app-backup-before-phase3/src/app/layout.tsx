import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Operating System",
  description: "A comprehensive SaaS platform to manage your identity, goals, and daily execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex flex-1 flex-col w-full min-w-0">
              <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b px-6 bg-background/80 backdrop-blur-md">
                <SidebarTrigger />
                <div className="w-full flex-1 font-semibold text-sm text-muted-foreground">
                  Command Center
                </div>
              </header>
              <div className="flex-1 p-4 md:p-6 bg-muted/20">
                {children}
              </div>
            </main>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
