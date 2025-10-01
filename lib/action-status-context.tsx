"use client"

import * as React from "react"

export type ActionStatus = "Not started" | "In progress" | "Completed"

interface ActionStatusContextType {
  currentStatus: ActionStatus
  setCurrentStatus: (status: ActionStatus) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const ActionStatusContext = React.createContext<ActionStatusContextType | undefined>(undefined)

export function ActionStatusProvider({ children }: { children: React.ReactNode }) {
  const [currentStatus, setCurrentStatus] = React.useState<ActionStatus>("Not started")
  const [isLoading, setIsLoading] = React.useState(false)

  return (
    <ActionStatusContext.Provider value={{ currentStatus, setCurrentStatus, isLoading, setIsLoading }}>
      {children}
    </ActionStatusContext.Provider>
  )
}

export function useActionStatus() {
  const context = React.useContext(ActionStatusContext)
  if (context === undefined) {
    throw new Error("useActionStatus must be used within an ActionStatusProvider")
  }
  return context
}
