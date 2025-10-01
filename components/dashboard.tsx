"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { type Ship, generateDetailedShipData, generateShipData } from "@/lib/data"
import ShipDetailView from "@/components/ship-detail-view"
import ThemeToggle from "@/components/theme-toggle"
import AllEventsView from "@/components/all-events-view"
import RasDetailView from "@/components/ras-detail-view"

const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-background flex items-center justify-center text-foreground">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading Map...</p>
      </div>
    </div>
  ),
})

export default function Dashboard() {
  const [view, setView] = React.useState<"map" | "detail" | "events" | "ras">("map")
  const [selectedShip, setSelectedShip] = React.useState<Ship | null>(null)
  const [allShips, setAllShips] = React.useState<Ship[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true)
        const ships = generateShipData()
        setAllShips(ships)
      } catch (error) {
        console.error("Error initializing ship data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  // 자동 새로고침을 위한 interval 추가
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (view === "map" && !isLoading) {
        setAllShips(generateShipData())
      }
    }, 30000) // 30초마다 자동 새로고침

    return () => clearInterval(interval)
  }, [view, isLoading])

  const handleSelectShip = (ship: Ship) => {
    // 최신 데이터로 선택된 선박 정보 업데이트
    const updatedShip = generateDetailedShipData(ship)
    setSelectedShip(updatedShip)
    setView("detail")
  }

  const handleBackToMap = () => {
    setSelectedShip(null)
    setView("map")
  }

  const handleViewAllEvents = () => {
    setView("events")
  }

  const handleViewRasDetails = (ship: Ship) => {
    setSelectedShip(ship)
    setView("ras")
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-background flex items-center justify-center text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Initializing Dashboard...</p>
        </div>
      </div>
    )
  }

  const renderView = () => {
    switch (view) {
      case "map":
        return <MapView ships={allShips} onSelectShip={handleSelectShip} onViewAllEvents={handleViewAllEvents} />
      case "detail":
        return <ShipDetailView ship={selectedShip} onBack={handleBackToMap} onViewRasDetails={handleViewRasDetails} />
      case "events":
        return <AllEventsView ships={allShips} onBack={handleBackToMap} />
      case "ras":
        return <RasDetailView ship={selectedShip} onBack={() => setView("detail")} />
      default:
        return <MapView ships={allShips} onSelectShip={handleSelectShip} onViewAllEvents={handleViewAllEvents} />
    }
  }

  return (
    <main className="relative w-full h-screen bg-background text-foreground overflow-hidden">
      <div className="absolute top-4 right-16 z-[1001]">
        <ThemeToggle />
      </div>
      {renderView()}
    </main>
  )
}
