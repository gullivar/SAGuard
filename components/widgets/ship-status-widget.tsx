"use client"

import * as React from "react"
import { type Ship, getOverallStatus } from "@/lib/data"
import { ShipIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ShipStatusWidget({
  ships,
  onViewAllEvents,
  onFilterByStatus,
}: {
  ships: Ship[]
  onViewAllEvents: () => void
  onFilterByStatus?: (status: "critical" | "warning" | "notice" | null) => void
}) {
  const statusCounts = React.useMemo(() => {
    const counts = {
      critical: 0,
      warning: 0,
      notice: 0,
    }
    ships.forEach((ship) => {
      const status = getOverallStatus(ship)
      if (["Critical", "High Risk", "Disconnected"].includes(status)) {
        counts.critical++
      } else if (["Warning", "Low Bandwidth"].includes(status)) {
        counts.warning++
      } else if (status === "OK") {
        counts.notice++
      }
    })
    return counts
  }, [ships])

  const handleStatusClick = (status: "critical" | "warning" | "notice") => {
    if (onFilterByStatus) {
      onFilterByStatus(status)
    }
  }

  return (
    <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg w-40">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <ShipIcon className="w-4 h-4 text-muted-foreground" />
        Ship Status
      </h3>
      <div className="space-y-2">
        <div
          className="flex items-center justify-between cursor-pointer hover:bg-muted/50 rounded p-1 -m-1 transition-colors"
          onClick={() => handleStatusClick("critical")}
        >
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-xs">Critical</span>
          </div>
          <span className="font-bold text-sm">{statusCounts.critical}</span>
        </div>
        <div
          className="flex items-center justify-between cursor-pointer hover:bg-muted/50 rounded p-1 -m-1 transition-colors"
          onClick={() => handleStatusClick("warning")}
        >
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-xs">Warning</span>
          </div>
          <span className="font-bold text-sm">{statusCounts.warning}</span>
        </div>
        <div
          className="flex items-center justify-between cursor-pointer hover:bg-muted/50 rounded p-1 -m-1 transition-colors"
          onClick={() => handleStatusClick("notice")}
        >
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-xs">Notice</span>
          </div>
          <span className="font-bold text-sm">{statusCounts.notice}</span>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-border">
        <Button variant="link" className="text-xs p-0 h-auto" onClick={onViewAllEvents}>
          View Details
        </Button>
      </div>
    </div>
  )
}
