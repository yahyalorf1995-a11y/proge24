import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "نظام التشغيل الشخصي",
  description: "منصة شاملة لإدارة هويتك وأهدافك وتنفيذك اليومي.",
};

// Deliberately minimal: this is the ONLY layout shared by both the public
// pages (/login, /signup) and the authenticated app (the "(app)" route
// group below, which has its own layout with the Sidebar + auth check).
// Do not add data fetching or auth-only UI here.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col overflow-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
