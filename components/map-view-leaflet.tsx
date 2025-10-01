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
<<<<<<< HEAD
  const [loadError, setLoadError] = React.useState<string | null>(null)
=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
  const [MapContainer, setMapContainer] = React.useState<any>(null)
  const [TileLayer, setTileLayer] = React.useState<any>(null)
  const [Marker, setMarker] = React.useState<any>(null)
  const [Tooltip, setTooltip] = React.useState<any>(null)
  const [MarkerClusterGroup, setMarkerClusterGroup] = React.useState<any>(null)
  const [L, setL] = React.useState<any>(null)

  React.useEffect(() => {
    const loadLeaflet = async () => {
      try {
<<<<<<< HEAD
        console.log("[v0] Starting to load Leaflet dependencies...")

        if (typeof document !== "undefined") {
          const existingLeafletCSS = document.querySelector('link[href*="leaflet"]')
          if (!existingLeafletCSS) {
            const leafletCSS = document.createElement("link")
            leafletCSS.rel = "stylesheet"
            leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            leafletCSS.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            leafletCSS.crossOrigin = ""
            leafletCSS.id = "leaflet-css" // Add ID for easier identification
            document.head.appendChild(leafletCSS)

            // Wait for CSS to load
            await new Promise((resolve) => {
              leafletCSS.onload = resolve
              leafletCSS.onerror = resolve // Continue even if CSS fails to load
            })
          }
        }

=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
        const [leafletModule, reactLeafletModule, markerClusterModule] = await Promise.all([
          import("leaflet"),
          import("react-leaflet"),
          import("react-leaflet-cluster"),
        ])

        const leaflet = leafletModule.default
<<<<<<< HEAD
        console.log("[v0] Leaflet modules loaded successfully")

        try {
          delete (leaflet.Icon.Default.prototype as any)._getIconUrl
          leaflet.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          })
        } catch (iconError) {
          console.warn("[v0] Icon setup warning:", iconError)
        }
=======

        // Fix default marker icons
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a

        setL(leaflet)
        setMapContainer(() => reactLeafletModule.MapContainer)
        setTileLayer(() => reactLeafletModule.TileLayer)
        setMarker(() => reactLeafletModule.Marker)
        setTooltip(() => reactLeafletModule.Tooltip)
        setMarkerClusterGroup(() => markerClusterModule.default)
        setIsLoaded(true)
<<<<<<< HEAD
        console.log("[v0] All Leaflet components loaded successfully")
      } catch (error) {
        console.error("[v0] Failed to load Leaflet:", error)
        setLoadError(error instanceof Error ? error.message : "Failed to load map")
=======
      } catch (error) {
        console.error("[v0] Failed to load Leaflet:", error)
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
      }
    }

    loadLeaflet()
  }, [])

  React.useEffect(() => {
    if (typeof document !== "undefined") {
<<<<<<< HEAD
      const existingStyle = document.querySelector("#leaflet-custom-styles")
      if (!existingStyle) {
        const style = document.createElement("style")
        style.id = "leaflet-custom-styles" // Add ID for easier identification
        style.textContent = `
          .leaflet-container {
            height: 100% !important;
            width: 100% !important;
            z-index: 1;
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
      }

      return () => {
        const styleElement = document.querySelector("#leaflet-custom-styles")
        if (styleElement && styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement)
        }
=======
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
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
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
<<<<<<< HEAD
      console.log("[v0] Invalidating map size for", ships.length, "ships")
      const timer = setTimeout(() => {
        try {
          map.invalidateSize()
          // Additional invalidation after a longer delay to ensure proper rendering
          setTimeout(() => {
            map.invalidateSize()
            console.log("[v0] Map size invalidated successfully")
          }, 500)
        } catch (error) {
          console.warn("[v0] Map invalidation warning:", error)
        }
      }, 100)
=======
      const timer = setTimeout(() => {
        map.invalidateSize()
        setTimeout(() => map.invalidateSize(), 200)
      }, 300)
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
      return () => clearTimeout(timer)
    }
  }, [ships, isLoaded])

  const handleZoomIn = () => {
    console.log("[v0] Zoom in clicked, mapRef.current:", mapRef.current)
    if (mapRef.current) {
<<<<<<< HEAD
      try {
        mapRef.current.zoomIn()
      } catch (error) {
        console.warn("[v0] Zoom in error:", error)
      }
=======
      mapRef.current.zoomIn()
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
    }
  }

  const handleZoomOut = () => {
    console.log("[v0] Zoom out clicked, mapRef.current:", mapRef.current)
    if (mapRef.current) {
<<<<<<< HEAD
      try {
        mapRef.current.zoomOut()
      } catch (error) {
        console.warn("[v0] Zoom out error:", error)
      }
=======
      mapRef.current.zoomOut()
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
    }
  }

  const setMapRef = React.useCallback((map: any) => {
<<<<<<< HEAD
    console.log("[v0] Map ref set:", map ? "Map instance" : "null")
    mapRef.current = map
    if (map) {
      setTimeout(() => {
        try {
          map.invalidateSize()
          console.log("[v0] Map initialized and size invalidated")
        } catch (error) {
          console.warn("[v0] Map initialization warning:", error)
        }
      }, 200)
    }
  }, [])

  if (loadError) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-2">Map Loading Error</div>
          <div className="text-sm text-muted-foreground">{loadError}</div>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => {
              setLoadError(null)
              setIsLoaded(false)
              // Retry loading
              window.location.reload()
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!isLoaded || !MapContainer || !TileLayer || !Marker || !Tooltip || !MarkerClusterGroup || !L) {
    return (
      <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <div className="text-muted-foreground">Loading map components...</div>
        </div>
=======
    console.log("[v0] Map ref set:", map)
    mapRef.current = map
  }, [])

  if (!isLoaded || !MapContainer || !TileLayer || !Marker || !Tooltip || !MarkerClusterGroup || !L) {
    return (
      <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
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
<<<<<<< HEAD
        whenCreated={(mapInstance) => {
          console.log("[v0] Map created callback triggered")
          setTimeout(() => {
            try {
              mapInstance.invalidateSize()
            } catch (error) {
              console.warn("[v0] Map creation invalidation warning:", error)
            }
          }, 100)
        }}
=======
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
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
