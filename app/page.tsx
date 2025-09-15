"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useSearchParams, useRouter } from "next/navigation"
import { type Ship, generateDetailedShipData, generateShipData } from "@/lib/data"
import ShipDetailView from "@/components/ship-detail-view"
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

export default function DashboardPage() {
  const [view, setView] = React.useState<"map" | "detail" | "events" | "ras">("map")
  const [selectedShip, setSelectedShip] = React.useState<Ship | null>(null)
  const [allShips, setAllShips] = React.useState<Ship[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  React.useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated")
      if (authStatus !== "true") {
        router.push("/login")
        return
      }
      setIsAuthenticated(true)
    }

    checkAuth()
  }, [router])

  React.useEffect(() => {
    if (!isAuthenticated) return

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
  }, [isAuthenticated])

  React.useEffect(() => {
    if (!isAuthenticated) return

    const shipId = searchParams.get("ship")
    if (shipId && allShips.length > 0 && selectedShip?.id !== shipId) {
      const ship = allShips.find((s) => s.id === shipId)
      if (ship) {
        const updatedShip = generateDetailedShipData(ship)
        setSelectedShip(updatedShip)
        setView("detail")
      }
    }
  }, [searchParams, allShips.length, selectedShip?.id, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="w-full h-screen bg-background flex items-center justify-center text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking Authentication...</p>
        </div>
      </div>
    )
  }

  const handleSelectShip = (ship: Ship) => {
    const updatedShip = generateDetailedShipData(ship)
    setSelectedShip(updatedShip)
    setView("detail")
  }

  const handleBackToMap = () => {
    console.log("handleBackToMap called")
    setSelectedShip(null)
    setView("map")
    // Clear any URL parameters
    window.history.replaceState({}, "", "/")
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

  return <div className="relative w-full h-screen bg-background text-foreground overflow-hidden">{renderView()}</div>
}
