"use client"

import * as React from "react"
import { generateShipData, type Ship } from "@/lib/data"
import ShipStatusWidget from "@/components/widgets/ship-status-widget"
import RasStatusWidget from "@/components/widgets/ras-status-widget"
import RefreshTimerWidget from "@/components/widgets/refresh-timer-widget"
import { useTheme } from "next-themes"

const MapView = React.lazy(() =>
  import("./map-view-leaflet").catch((error) => {
    console.error("[v0] Failed to load map component:", error)
    return {
      default: () => (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <div className="text-center">
            <div className="text-destructive mb-2">Failed to load map</div>
            <div className="text-sm text-muted-foreground">Please refresh the page</div>
          </div>
        </div>
      ),
    }
  }),
)

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
      <React.Suspense
        fallback={
          <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <div className="text-muted-foreground">Loading map...</div>
            </div>
          </div>
        }
      >
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
