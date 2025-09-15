"use client"

import type React from "react"

import { useSidebar } from "./sidebar-context"

interface MainContentProps {
  children: React.ReactNode
}

export default function MainContent({ children }: MainContentProps) {
  const { isMinimized } = useSidebar()

  return (
    <main className={`flex-1 transition-all duration-300 ease-in-out ${isMinimized ? "pl-16" : "pl-64"}`}>
      {children}
    </main>
  )
}
