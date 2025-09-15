"use client"

import * as React from "react"
import type { Ship } from "@/lib/data"
import { Users, Server } from "lucide-react"

export default function RasStatusWidget({ ships }: { ships: Ship[] }) {
  // This is a placeholder logic. In a real app, this would come from an API.
  const rasStatus = React.useMemo(() => {
    const userCount = 25 + Math.floor(Math.random() * 10) - 5
    const cbsCount = 150 + Math.floor(Math.random() * 20) - 10
    return { userCount, cbsCount }
  }, [ships]) // Recalculate when ships data refreshes

  return (
    <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <Users className="w-5 h-5 mb-1 text-muted-foreground" />
          <span className="text-xl font-bold">{rasStatus.userCount}</span>
          <span className="text-xs text-muted-foreground">Users</span>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="flex flex-col items-center">
          <Server className="w-5 h-5 mb-1 text-muted-foreground" />
          <span className="text-xl font-bold">{rasStatus.cbsCount}</span>
          <span className="text-xs text-muted-foreground">CBS</span>
        </div>
      </div>
    </div>
  )
}
