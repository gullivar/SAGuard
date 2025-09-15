"use client"

import * as React from "react"
import { generateShipData, type Ship } from "@/lib/data"
import ShipStatusWidget from "@/components/widgets/ship-status-widget"
import RasStatusWidget from "@/components/widgets/ras-status-widget"
import RefreshTimerWidget from "@/components/widgets/refresh-timer-widget"
import { useTheme } from "next-themes"

const MapView = React.lazy(() => import("./map-view-leaflet"))

interface MapViewProps {
  ships: Ship[]
  onSelectShip: (ship: Ship) => void
  onViewAllEvents: () => void
}

export default function MapViewWrapper({ ships, onSelectShip, onViewAllEvents }: MapViewProps) {
  const [currentShips, setCurrentShips] = React.useState<Ship[]>(ships)
  const [refreshInterval, setRefreshInterval] = React.useState<number>(0)
  const { theme } = useTheme()

  React.useEffect(() => {
    setCurrentShips(ships)
  }, [ships])

  const refreshData = React.useCallback(() => {
    console.log("[v0] Refreshing ship data...")
    const newShips = generateShipData()
    setCurrentShips(newShips)
  }, [])

  React.useEffect(() => {
    console.log("[v0] Refresh interval changed to:", refreshInterval)
    if (refreshInterval > 0) {
      const timerId = setInterval(refreshData, refreshInterval)
      return () => clearInterval(timerId)
    }
  }, [refreshInterval, refreshData])

  return (
    <div className="w-full h-full relative">
      <React.Suspense fallback={<div className="w-full h-full bg-muted animate-pulse" />}>
        <MapView ships={currentShips} onSelectShip={onSelectShip} onViewAllEvents={onViewAllEvents} theme={theme} />
      </React.Suspense>
      <div className="absolute top-4 left-4 z-[1000]">
        <ShipStatusWidget ships={currentShips} onViewAllEvents={onViewAllEvents} />
      </div>
      <div className="absolute top-4 right-20 z-[1000] flex items-start gap-4">
        <RefreshTimerWidget onIntervalChange={setRefreshInterval} />
        <RasStatusWidget ships={currentShips} />
      </div>
    </div>
  )
}
