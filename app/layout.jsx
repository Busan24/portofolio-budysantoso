"use client";

import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import Header from "@/components/Header";
import { ThemeProvider } from "@/context/ThemeContext";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: '--font-jetbrainsMono'
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  // Semua route admin tidak menampilkan Header portfolio
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={jetbrainsMono.variable} suppressHydrationWarning>
        <ThemeProvider>
          {/* Header hanya untuk visitor/portfolio public, tidak untuk admin */}
          {mounted && !isAdminRoute && <Header />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
