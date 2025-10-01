"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { Ship, Asset } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LayoutDashboard } from "lucide-react"
import RasSummary from "@/components/ship-detail/ras-summary"
import SecurityEventSummary from "@/components/ship-detail/security-event-summary"
import NetworkTopology from "@/components/ship-detail/network-topology"
import ResourceMonitoring from "@/components/ship-detail/resource-monitoring"
import AssetList from "@/components/ship-detail/asset-list"
import AssetChangeLog from "@/components/ship-detail/asset-change-log"
import EventList from "@/components/ship-detail/event-list"
import AssetDetailModal from "@/components/ship-detail/asset-detail-modal"

interface ShipDetailViewProps {
  ship: Ship | null
  onBack: () => void
  onViewRasDetails: (ship: Ship) => void
  statusFilter?: "critical" | "warning" | "ok" | null
}

export default function ShipDetailView({ ship, onBack, onViewRasDetails, statusFilter }: ShipDetailViewProps) {
  const router = useRouter()
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [eventFilters, setEventFilters] = React.useState({ severity: "", type: "", search: "" })
  const eventListRef = React.useRef<HTMLDivElement>(null)

  const handleBackClick = () => {
    console.log("Back to Map button clicked")
    if (onBack) {
      onBack()
    } else {
      console.error("onBack callback is not provided")
    }
  }

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset)
  }

  const handleOpenAssetModal = (asset: Asset) => {
    setSelectedAsset(asset)
    setIsModalOpen(true)
  }

  const handleFilterBySeverity = (severity: "critical" | "warning" | "notice") => {
    setEventFilters((prev) => ({ ...prev, severity }))
    setTimeout(() => {
      eventListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

  const handleRasDetailsClick = () => {
    if (ship) {
      router.push(`/detailed-connection/${ship.id}`)
    }
  }

  const handleDashboardClick = () => {
    router.push("/")
  }

  if (!ship) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>No ship selected.</p>
        <Button onClick={onBack} variant="link">
          Back to Map
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="w-full h-full p-4 md:p-6 overflow-y-auto bg-background text-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 mb-4">
            <Button
              onClick={handleBackClick}
              variant="outline"
              className="bg-transparent hover:bg-accent hover:text-accent-foreground"
              type="button"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Map
            </Button>
            <Button
              onClick={handleDashboardClick}
              variant="outline"
              className="bg-transparent hover:bg-accent hover:text-accent-foreground"
              type="button"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            {ship.name} ({ship.id}) - Ship Detail
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RasSummary onDetailsClick={handleRasDetailsClick} />
            <SecurityEventSummary
              events={ship.securityEvents || []}
              onFilterBySeverity={handleFilterBySeverity}
              statusFilter={statusFilter}
            />
            <div className="lg:col-span-2">
              <NetworkTopology
                assets={ship.assets || []}
                onNodeDoubleClick={handleOpenAssetModal}
                onNodeClick={handleSelectAsset}
                shipId={ship.id}
              />
            </div>
            <div className="lg:col-span-2">
              <ResourceMonitoring
                assets={ship.assets || []}
                selectedAssetId={selectedAsset?.assetId}
                onAssetSelect={handleSelectAsset}
              />
            </div>
            <div className="lg:col-span-2">
              <AssetList assets={ship.assets || []} />
            </div>
            <div className="lg:col-span-2">
              <AssetChangeLog changeLogs={ship.changeLog || []} />
            </div>
            <div className="lg:col-span-2" ref={eventListRef}>
              <EventList
                events={ship.securityEvents || []}
                filters={eventFilters}
                setFilters={setEventFilters}
                statusFilter={statusFilter}
              />
            </div>
          </div>
        </div>
      </div>
      <AssetDetailModal asset={selectedAsset} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
