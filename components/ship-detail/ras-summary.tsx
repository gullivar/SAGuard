"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShipIcon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RasSummary({ onDetailsClick }: { onDetailsClick: () => void }) {
  // Mock data for now
  const userCount = 7
  const cbsCount = 10

  const getStatusColor = (count: number, thresholds: { warn: number; crit: number }) => {
    if (count >= thresholds.crit) return "border-red-500 shadow-red-500/50"
    if (count >= thresholds.warn) return "border-yellow-500 shadow-yellow-500/50"
    return "border-green-500 shadow-green-500/50"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>RAS Connection Summary</CardTitle>
        <Button size="sm" onClick={onDetailsClick} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Info className="mr-2 h-4 w-4" />
          Detailed Info
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-around gap-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center bg-muted/30 shadow-lg transition-all ${getStatusColor(
                userCount,
                { warn: 5, crit: 10 },
              )}`}
            >
              <Users className="h-8 w-8 text-muted-foreground" />
              <span className="text-2xl font-bold">{userCount}</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">Users</span>
          </div>

          <div className="h-1 w-16 bg-border rounded-full" />

          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center bg-muted/30 shadow-lg transition-all ${getStatusColor(
                cbsCount,
                { warn: 10, crit: 15 },
              )}`}
            >
              <ShipIcon className="h-8 w-8 text-muted-foreground" />
              <span className="text-2xl font-bold">{cbsCount}</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">CBS</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
