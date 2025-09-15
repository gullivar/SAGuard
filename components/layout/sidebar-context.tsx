"use client"

import * as React from "react"

interface SidebarContextType {
  isMinimized: boolean
  setIsMinimized: (minimized: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMinimized, setIsMinimized] = React.useState(false)

  return <SidebarContext.Provider value={{ isMinimized, setIsMinimized }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
