"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ShieldAlertIcon as ShieldWarning, ShieldCheck } from "lucide-react"

interface SecurityEventSummaryProps {
  events: any[]
  onFilterBySeverity: (severity: "critical" | "warning" | "notice") => void
  statusFilter?: "critical" | "warning" | "ok" | null
}

export default function SecurityEventSummary({ events, onFilterBySeverity, statusFilter }: SecurityEventSummaryProps) {
  const filteredEvents = React.useMemo(() => {
    if (!statusFilter) return events

    return events.filter((event) => {
      const severity = event.severity?.toLowerCase()
      if (statusFilter === "critical") {
        return severity === "critical"
      } else if (statusFilter === "warning") {
        return severity === "warning"
      } else if (statusFilter === "ok") {
        return severity === "notice" // OK status shows only notice events
      }
      return true
    })
  }, [events, statusFilter])

  const counts = filteredEvents.reduce(
    (acc, event) => {
      const severity = event.severity?.toLowerCase()
      if (severity === "critical") acc.critical++
      else if (severity === "warning") acc.warning++
      else if (severity === "notice") acc.notice++
      return acc
    },
    { critical: 0, warning: 0, notice: 0 },
  )

  const displayCounts = React.useMemo(() => {
    if (statusFilter === "critical") {
      return { critical: counts.critical, warning: 0, notice: 0 }
    } else if (statusFilter === "warning") {
      return { critical: 0, warning: counts.warning, notice: 0 }
    } else if (statusFilter === "ok") {
      return { critical: 0, warning: 0, notice: counts.notice }
    }
    return counts
  }, [counts, statusFilter])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Event Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around items-start text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <ShieldAlert className="h-12 w-12 text-red-500" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {displayCounts.critical}
              </span>
            </div>
            <span className="font-semibold">Critical</span>
            <Button
              size="sm"
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onFilterBySeverity("critical")}
            >
              Details
            </Button>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <ShieldWarning className="h-12 w-12 text-yellow-500" />
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {displayCounts.warning}
              </span>
            </div>
            <span className="font-semibold">Warning</span>
            <Button
              size="sm"
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onFilterBySeverity("warning")}
            >
              Details
            </Button>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <ShieldCheck className="h-12 w-12 text-blue-500" />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {displayCounts.notice}
              </span>
            </div>
            <span className="font-semibold">Notice</span>
            <Button
              size="sm"
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onFilterBySeverity("notice")}
            >
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
