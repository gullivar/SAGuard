"use client"

import type React from "react"
import { ThemeProvider } from "next-themes"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"
import { SidebarProvider } from "@/components/layout/sidebar-context"
import MainContent from "@/components/layout/main-content"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {isLoginPage ? (
        children
      ) : (
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <MainContent>{children}</MainContent>
          </div>
        </SidebarProvider>
      )}
    </ThemeProvider>
  )
}
