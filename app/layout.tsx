// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OYU APQM Formu",
  description: "Odlar Yurdu Universiteti Akademik Performans Qiymətləndirmə Formu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <div className="max-w-5xl mx-auto py-8 px-4">
          {children}
        </div>
      </body>
    </html>
  );
}