"use client"

import * as React from "react"
import { getOverallStatus, type Ship } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"

interface MapViewLeafletProps {
  ships: Ship[]
  onSelectShip: (ship: Ship) => void
  onViewAllEvents: () => void
  theme?: string
}

export default function MapViewLeaflet({ ships, onSelectShip, onViewAllEvents, theme }: MapViewLeafletProps) {
  const mapRef = React.useRef<any>(null)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [MapContainer, setMapContainer] = React.useState<any>(null)
  const [TileLayer, setTileLayer] = React.useState<any>(null)
  const [Marker, setMarker] = React.useState<any>(null)
  const [Tooltip, setTooltip] = React.useState<any>(null)
  const [MarkerClusterGroup, setMarkerClusterGroup] = React.useState<any>(null)
  const [L, setL] = React.useState<any>(null)

  React.useEffect(() => {
    const loadLeaflet = async () => {
      try {
        const [leafletModule, reactLeafletModule, markerClusterModule] = await Promise.all([
          import("leaflet"),
          import("react-leaflet"),
          import("react-leaflet-cluster"),
        ])

        const leaflet = leafletModule.default

        // Fix default marker icons
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })

        setL(leaflet)
        setMapContainer(() => reactLeafletModule.MapContainer)
        setTileLayer(() => reactLeafletModule.TileLayer)
        setMarker(() => reactLeafletModule.Marker)
        setTooltip(() => reactLeafletModule.Tooltip)
        setMarkerClusterGroup(() => markerClusterModule.default)
        setIsLoaded(true)
      } catch (error) {
        console.error("[v0] Failed to load Leaflet:", error)
      }
    }

    loadLeaflet()
  }, [])

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.createElement("style")
      style.textContent = `
        .leaflet-container {
          height: 100%;
          width: 100%;
        }
        .leaflet-control-container .leaflet-routing-container-hide {
          display: none;
        }
        .ship-marker {
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .marker-ok {
          background-color: #22c55e;
        }
        .marker-warning {
          background-color: #f59e0b;
        }
        .marker-critical {
          background-color: #ef4444;
        }
        .marker-disconnected {
          background-color: #6b7280;
        }
        .marker-cluster {
          background-clip: padding-box;
          border-radius: 20px;
        }
        .marker-cluster div {
          width: 30px;
          height: 30px;
          margin-left: 5px;
          margin-top: 5px;
          text-align: center;
          border-radius: 15px;
          font: 12px "Helvetica Neue", Arial, Helvetica, sans-serif;
        }
        .marker-cluster span {
          line-height: 30px;
        }
        .marker-cluster-small {
          background-color: rgba(181, 226, 140, 0.6);
        }
        .marker-cluster-small div {
          background-color: rgba(110, 204, 57, 0.6);
        }
        .marker-cluster-medium {
          background-color: rgba(241, 211, 87, 0.6);
        }
        .marker-cluster-medium div {
          background-color: rgba(240, 194, 12, 0.6);
        }
        .marker-cluster-large {
          background-color: rgba(253, 156, 115, 0.6);
        }
        .marker-cluster-large div {
          background-color: rgba(241, 128, 23, 0.6);
        }
        .marker-cluster-critical {
          background-color: rgba(239, 68, 68, 0.6) !important;
        }
        .marker-cluster-critical div {
          background-color: rgba(220, 38, 38, 0.8) !important;
        }
        .marker-cluster-warning {
          background-color: rgba(245, 158, 11, 0.6) !important;
        }
        .marker-cluster-warning div {
          background-color: rgba(217, 119, 6, 0.8) !important;
        }
      `
      document.head.appendChild(style)
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [])

  const getMarkerIcon = React.useCallback(
    (status: string) => {
      if (!L) return null

      let markerClass = "marker-ok"
      switch (status) {
        case "Critical":
        case "High Risk":
        case "Disconnected":
          markerClass = "marker-critical"
          break
        case "Warning":
        case "Low Bandwidth":
          markerClass = "marker-warning"
          break
        case "OK":
          markerClass = "marker-ok"
          break
        case "Unknown":
        default:
          markerClass = "marker-disconnected"
          break
      }
      return L.divIcon({
        className: `ship-marker ${markerClass}`,
        html: "",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })
    },
    [L],
  )

  const createClusterIcon = React.useCallback(
    (cluster: any) => {
      if (!L) return null

      const children = cluster.getAllChildMarkers()
      const count = children.length
      let clusterStatus = "ok"

      children.forEach((marker: any) => {
        if (marker.options.shipData) {
          const shipStatus = getOverallStatus(marker.options.shipData)
          if (["Critical", "High Risk", "Disconnected"].includes(shipStatus)) {
            clusterStatus = "critical"
          } else if (["Warning", "Low Bandwidth"].includes(shipStatus) && clusterStatus !== "critical") {
            clusterStatus = "warning"
          }
        }
      })

      let cname = "marker-cluster-"
      if (count < 10) cname += "small"
      else if (count < 100) cname += "medium"
      else cname += "large"

      if (clusterStatus === "critical") cname += " marker-cluster-critical"
      else if (clusterStatus === "warning") cname += " marker-cluster-warning"

      return L.divIcon({
        html: `<div><span>${count}</span></div>`,
        className: `marker-cluster ${cname}`,
        iconSize: new L.Point(40, 40),
      })
    },
    [L],
  )

  React.useEffect(() => {
    const map = mapRef.current
    if (map && isLoaded) {
      const timer = setTimeout(() => {
        map.invalidateSize()
        setTimeout(() => map.invalidateSize(), 200)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [ships, isLoaded])

  const handleZoomIn = () => {
    console.log("[v0] Zoom in clicked, mapRef.current:", mapRef.current)
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    console.log("[v0] Zoom out clicked, mapRef.current:", mapRef.current)
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
  }

  const setMapRef = React.useCallback((map: any) => {
    console.log("[v0] Map ref set:", map)
    mapRef.current = map
  }, [])

  if (!isLoaded || !MapContainer || !TileLayer || !Marker || !Tooltip || !MarkerClusterGroup || !L) {
    return (
      <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    )
  }

  return (
    <>
      <MapContainer
        ref={setMapRef}
        center={[20, 10]}
        zoom={3}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
        style={{
          backgroundColor: theme === "dark" ? "hsl(var(--background))" : "#f8f9fa",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={
            theme === "dark"
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
        />
        <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterIcon}>
          {ships.map((ship) => (
            <Marker
              key={ship.id}
              position={[ship.lat, ship.lon]}
              icon={getMarkerIcon(getOverallStatus(ship))}
              eventHandlers={{
                click: () => {
                  onSelectShip(ship)
                },
              }}
              shipData={ship}
            >
              <Tooltip>
                {ship.name}
                <br />
                Status: {getOverallStatus(ship)}
              </Tooltip>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/80 backdrop-blur-sm border-border hover:bg-muted/50"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/80 backdrop-blur-sm border-border hover:bg-muted/50"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}
