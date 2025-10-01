"use client"

import * as React from "react"
import type { Asset } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

// Dynamically import vis-network to avoid SSR issues
import type { Network } from "vis-network/standalone"
import type { DataSet } from "vis-data/standalone"
const vis = typeof window !== "undefined" ? require("vis-network/standalone") : null

interface NetworkNode {
  id: string
  x: number
  y: number
  type: "server" | "switch" | "router" | "firewall" | "pc" | "sensor"
  label: string
  ip?: string
  status: "online" | "offline" | "warning"
}

interface NetworkConnection {
  id: string
  from: string
  to: string
  type: "ethernet" | "fiber" | "wireless" | "arrow" | "normal"
  bandwidth?: string
  label?: string
}

interface ShipTopology {
  shipId: string
  shipName: string
  nodes: NetworkNode[]
  connections: NetworkConnection[]
  lastModified: string
}

interface NetworkTopologyProps {
  assets: Asset[]
  onNodeClick: (asset: Asset) => void
  onNodeDoubleClick: (asset: Asset) => void
  shipId?: string // Added shipId prop to identify which ship's topology to load
}

export default function NetworkTopology({ assets, onNodeClick, onNodeDoubleClick, shipId }: NetworkTopologyProps) {
  const visNetworkRef = React.useRef<HTMLDivElement>(null)
  const networkInstanceRef = React.useRef<Network | null>(null)
  const [containerReady, setContainerReady] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const loadSavedTopology = React.useCallback((): ShipTopology | null => {
    if (!shipId || typeof window === "undefined") return null

    try {
      const saved = localStorage.getItem("ship-topologies")
      if (saved) {
        const savedTopologies: ShipTopology[] = JSON.parse(saved)
        return savedTopologies.find((t) => t.shipId === shipId) || null
      }
    } catch (error) {
      console.error("Failed to load saved topology:", error)
    }
    return null
  }, [shipId])

  const convertTopologyToVisNetwork = React.useCallback((topology: ShipTopology) => {
    const nodes = new vis.DataSet(
      topology.nodes.map((node) => ({
        id: node.id,
        label: node.label,
        title: `${node.type.toUpperCase()}\n${node.label}\n${node.ip || "No IP"}`,
        group: node.type,
        x: node.x,
        y: node.y,
        fixed: { x: true, y: true }, // Fix positions for saved topologies
        physics: false, // Disable physics for saved nodes
      })),
    )

    const edges = new vis.DataSet(
      topology.connections.map((connection) => ({
        id: connection.id,
        from: connection.from,
        to: connection.to,
        label: connection.label || connection.bandwidth || "",
        color: {
          color: connection.type === "fiber" ? "#f59e0b" : connection.type === "wireless" ? "#10b981" : "#374151",
          highlight: connection.type === "fiber" ? "#fbbf24" : connection.type === "wireless" ? "#34d399" : "#4b5563",
        },
        width: connection.type === "fiber" ? 3 : 2,
        dashes: connection.type === "wireless" ? [5, 5] : false,
        smooth: { type: "continuous" },
        font: { size: 12, color: "#374151", strokeWidth: 2, strokeColor: "#ffffff" },
      })),
    )

    return { nodes, edges }
  }, [])

  React.useEffect(() => {
    if (!visNetworkRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setContainerReady(true)
        }
      }
    })

    observer.observe(visNetworkRef.current)

    // Fallback timer
    const timer = setTimeout(() => {
      setContainerReady(true)
    }, 200)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])

  React.useEffect(() => {
    if (visNetworkRef.current && vis && containerReady) {
      setIsLoading(true)
      const savedTopology = loadSavedTopology()

      let data
      if (savedTopology) {
        console.log("[v0] Loading saved topology:", savedTopology)
        data = convertTopologyToVisNetwork(savedTopology)
      } else if (assets.length > 0) {
        // Use default asset connections
        const nodes: DataSet<any> = new vis.DataSet(
          assets.map((asset) => ({
            id: asset.assetId,
            label: asset.hwType,
            title: `${asset.typeComponentModelNo}\n${asset.ipAddress}`,
            group: asset.hwType,
          })),
        )

        const edges: DataSet<any> = new vis.DataSet(
          assets.flatMap(
            (asset) =>
              asset.connections?.map((targetId) => ({
                from: asset.assetId,
                to: targetId,
              })) || [],
          ),
        )

        data = { nodes, edges }
      } else {
        setIsLoading(false)
        return
      }

      const options = {
        autoResize: true,
        height: "100%",
        width: "100%",
        locale: "en",
        nodes: {
          shape: "dot",
          size: 25, // Increased size for better visibility
          font: {
            size: 14,
            color: "#ffffff",
            strokeWidth: 2,
            strokeColor: "#000000",
          },
          borderWidth: 3,
          shadow: {
            enabled: true,
            color: "rgba(0,0,0,0.3)",
            size: 10,
            x: 2,
            y: 2,
          },
        },
        edges: {
          width: 2,
          color: { inherit: "from" },
          shadow: {
            enabled: true,
            color: "rgba(0,0,0,0.2)",
            size: 5,
            x: 1,
            y: 1,
          },
        },
        physics: {
          enabled: !savedTopology, // Disable physics for saved topologies
          barnesHut: {
            gravitationalConstant: -30000,
            centralGravity: 0.1,
            springLength: 120,
          },
          stabilization: {
            enabled: !savedTopology,
            iterations: savedTopology ? 0 : 100,
            updateInterval: 25,
          },
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView: true,
          dragView: true,
        },
        groups: {
          Switch: {
            color: { background: "#3b82f6", border: "#60a5fa" },
            shape: "icon",
            icon: { code: "f0e8", face: "'Font Awesome 6 Free'", weight: "900", color: "#ffffff" },
          },
          Router: {
            color: { background: "#f97316", border: "#fb923c" },
            shape: "icon",
            icon: { code: "f6ff", face: "'Font Awesome 6 Free'", weight: "900", color: "#ffffff" },
          },
          Firewall: {
            color: { background: "#ef4444", border: "#f87171" },
            shape: "icon",
            icon: { code: "f3ed", face: "'Font Awesome 6 Free'", weight: "900", color: "#ffffff" },
          },
          Server: {
            color: { background: "#8b5cf6", border: "#a78bfa" },
            shape: "icon",
            icon: { code: "f233", face: "'Font Awesome 6 Free'", weight: "900", color: "#ffffff" },
          },
          PC: {
            color: { background: "#14b8a6", border: "#2dd4bf" },
            shape: "icon",
            icon: { code: "f109", face: "'Font Awesome 6 Free'", weight: "900", color: "#ffffff" },
          },
          Camera: {
            color: { background: "#64748b", border: "#94a3b8" },
            shape: "icon",
            icon: { code: "f030", face: "'Font Awesome 6 Free'", weight: "900", color: "#ffffff" },
          },
          PLC: {
            color: { background: "#ec4899", border: "#f472b6" },
            shape: "icon",
            icon: { code: "f7f0", face: "'Font Awesome 6 Free'", weight: "900", color: "#ffffff" },
          },
          Sensor: { color: { background: "#a1a1aa", border: "#d4d4d8" }, shape: "dot", size: 10 },
          switch: {
            color: { background: "#10b981", border: "#34d399" },
            shape: "box",
            font: { color: "#ffffff", size: 12 },
          },
          router: {
            color: { background: "#f59e0b", border: "#fbbf24" },
            shape: "box",
            font: { color: "#ffffff", size: 12 },
          },
          firewall: {
            color: { background: "#ef4444", border: "#f87171" },
            shape: "box",
            font: { color: "#ffffff", size: 12 },
          },
          server: {
            color: { background: "#3b82f6", border: "#60a5fa" },
            shape: "box",
            font: { color: "#ffffff", size: 12 },
          },
          pc: {
            color: { background: "#8b5cf6", border: "#a78bfa" },
            shape: "box",
            font: { color: "#ffffff", size: 12 },
          },
          sensor: {
            color: { background: "#06b6d4", border: "#22d3ee" },
            shape: "dot",
            size: 15,
            font: { color: "#ffffff", size: 10 },
          },
        },
      }

      const network = new vis.Network(visNetworkRef.current, data, options)
      networkInstanceRef.current = network

      const fitNetwork = () => {
        try {
          const currentNetwork = networkInstanceRef.current
          if (currentNetwork && typeof currentNetwork.fit === "function") {
            currentNetwork.fit({
              animation: {
                duration: 800,
                easingFunction: "easeInOutQuad",
              },
            })
            setIsLoading(false)
            console.log("[v0] Network fitted successfully")
          } else {
            console.warn("[v0] Network instance not available for fitting")
            setIsLoading(false)
          }
        } catch (error) {
          console.error("Failed to fit network view:", error)
          setIsLoading(false)
        }
      }

      if (savedTopology) {
        // For saved topologies, fit immediately since positions are fixed
        setTimeout(fitNetwork, 300)
      } else {
        // For physics-based layouts, wait for stabilization
        network.once("stabilizationIterationsDone", () => {
          setTimeout(fitNetwork, 200)
        })

        // Fallback timer
        setTimeout(() => {
          if (isLoading) {
            fitNetwork()
          }
        }, 2000)
      }

      const handleResize = () => {
        const currentNetwork = networkInstanceRef.current
        if (
          currentNetwork &&
          !isLoading &&
          typeof currentNetwork.redraw === "function" &&
          typeof currentNetwork.fit === "function"
        ) {
          setTimeout(() => {
            try {
              const stillCurrentNetwork = networkInstanceRef.current
              if (
                stillCurrentNetwork &&
                typeof stillCurrentNetwork.redraw === "function" &&
                typeof stillCurrentNetwork.fit === "function"
              ) {
                stillCurrentNetwork.redraw()
                stillCurrentNetwork.fit({
                  animation: { duration: 300 },
                })
              }
            } catch (error) {
              console.error("Failed to resize network:", error)
            }
          }, 100)
        }
      }

      window.addEventListener("resize", handleResize)

      network.on("click", (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0]
          if (savedTopology) {
            const node = savedTopology.nodes.find((n) => n.id === nodeId)
            if (node) {
              const mockAsset: Asset = {
                assetId: node.id,
                function: node.label,
                systemSuC: "System A",
                systemSupplier: "GUI Editor",
                typeComponentModelNo: `${node.type}-${node.id}`,
                hwType: node.type.charAt(0).toUpperCase() + node.type.slice(1),
                location: "Custom",
                ipAddress: node.ip,
              }
              onNodeClick(mockAsset)
            }
          } else {
            const clickedAsset = assets.find((a) => a.assetId === nodeId)
            if (clickedAsset) onNodeClick(clickedAsset)
          }
        }
      })

      network.on("doubleClick", (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0]
          if (savedTopology) {
            const node = savedTopology.nodes.find((n) => n.id === nodeId)
            if (node) {
              const mockAsset: Asset = {
                assetId: node.id,
                function: node.label,
                systemSuC: "System A",
                systemSupplier: "GUI Editor",
                typeComponentModelNo: `${node.type}-${node.id}`,
                hwType: node.type.charAt(0).toUpperCase() + node.type.slice(1),
                location: "Custom",
                ipAddress: node.ip,
              }
              onNodeDoubleClick(mockAsset)
            }
          } else {
            const doubleClickedAsset = assets.find((a) => a.assetId === nodeId)
            if (doubleClickedAsset) onNodeDoubleClick(doubleClickedAsset)
          }
        }
      })

      return () => {
        window.removeEventListener("resize", handleResize)
        const currentNetwork = networkInstanceRef.current
        if (currentNetwork && typeof currentNetwork.destroy === "function") {
          try {
            currentNetwork.destroy()
          } catch (error) {
            console.error("Failed to destroy network:", error)
          }
        }
        networkInstanceRef.current = null
      }
    }
  }, [assets, onNodeClick, onNodeDoubleClick, shipId, loadSavedTopology, convertTopologyToVisNetwork, containerReady]) // Added containerReady dependency

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Network Topology</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Double-click a node to see asset details.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-10">
              <div className="text-sm text-muted-foreground">Loading network topology...</div>
            </div>
          )}
          <div
            ref={visNetworkRef}
            className="h-[600px] min-h-[600px] w-full bg-muted/20 rounded-lg border"
            style={{ minHeight: "600px" }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
