"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, Upload, Download, Trash2, Move, Link2 } from "lucide-react"
import { generateShipData, type Ship } from "@/lib/data"

interface NetworkNode {
  id: string
  x: number
  y: number
  type: "server" | "switch" | "router" | "firewall" | "pc" | "sensor"
  label: string
  ip?: string
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

const nodeTypes = [
  { value: "server", label: "Server", color: "#3b82f6" },
  { value: "switch", label: "Switch", color: "#10b981" },
  { value: "router", label: "Router", color: "#f59e0b" },
  { value: "firewall", label: "Firewall", color: "#ef4444" },
  { value: "pc", label: "PC", color: "#8b5cf6" },
  { value: "sensor", label: "Sensor", color: "#06b6d4" },
]

const connectionTypes = [
  { value: "ethernet", label: "Ethernet (Normal Line)", color: "#374151", style: "normal" },
  { value: "fiber", label: "Fiber Optic (Arrow)", color: "#f59e0b", style: "arrow" },
  { value: "wireless", label: "Wireless (Normal Line)", color: "#10b981", style: "normal" },
  { value: "arrow", label: "Arrow Connection", color: "#ef4444", style: "arrow" },
  { value: "normal", label: "Normal Line", color: "#6b7280", style: "normal" },
]

export default function GuiEditorPage() {
  const [ships, setShips] = useState<Ship[]>([])
  const [selectedShipId, setSelectedShipId] = useState<string>("")
  const [savedTopologies, setSavedTopologies] = useState<ShipTopology[]>([])

  const [nodes, setNodes] = useState<NetworkNode[]>([
    { id: "1", x: 200, y: 150, type: "server", label: "Main Server", ip: "192.168.1.10" },
    { id: "2", x: 400, y: 150, type: "switch", label: "Core Switch", ip: "192.168.1.1" },
    { id: "3", x: 600, y: 100, type: "router", label: "Gateway Router", ip: "192.168.1.254" },
    { id: "4", x: 600, y: 200, type: "firewall", label: "Security FW", ip: "192.168.1.2" },
  ])

  const [connections, setConnections] = useState<NetworkConnection[]>([
    { id: "1", from: "1", to: "2", type: "ethernet", bandwidth: "1Gbps", label: "Connection 1" },
    { id: "2", from: "2", to: "3", type: "fiber", bandwidth: "10Gbps", label: "Connection 2" },
    { id: "3", from: "2", to: "4", type: "ethernet", bandwidth: "1Gbps", label: "Connection 3" },
  ])

  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<NetworkConnection | null>(null)
  const [mode, setMode] = useState<"select" | "add-node" | "add-connection">("select")
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connectionStart, setConnectionStart] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(1.0)

  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const shipData = generateShipData()
    setShips(shipData)

    // Bulk Carrier #16 (SHIP016)을 기본 선택
    const bulkCarrier16 = shipData.find((ship) => ship.id === "SHIP016")
    if (bulkCarrier16) {
      setSelectedShipId(bulkCarrier16.id)
    }

    // 로컬 스토리지에서 저장된 토폴로지 로드
    const saved = localStorage.getItem("ship-topologies")
    if (saved) {
      try {
        setSavedTopologies(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load saved topologies:", error)
      }
    }
  }, [])

  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      if (mode === "select") {
        const node = nodes.find((n) => n.id === nodeId)
        if (node) {
          setDraggedNode(nodeId)
          const rect = canvasRef.current?.getBoundingClientRect()
          if (rect) {
            setDragOffset({
              x: e.clientX - rect.left - node.x,
              y: e.clientY - rect.top - node.y,
            })
          }
        }
      } else if (mode === "add-connection") {
        if (!connectionStart) {
          setConnectionStart(nodeId)
        } else if (connectionStart !== nodeId) {
          const newConnection: NetworkConnection = {
            id: Date.now().toString(),
            from: connectionStart,
            to: nodeId,
            type: "ethernet",
            bandwidth: "1Gbps",
            label: `Connection ${connections.length + 1}`,
          }
          setConnections([...connections, newConnection])
          setConnectionStart(null)
        }
      }
    },
    [mode, nodes, connections, connectionStart],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (draggedNode && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        const newX = e.clientX - rect.left - dragOffset.x
        const newY = e.clientY - rect.top - dragOffset.y

        setNodes(
          nodes.map((node) =>
            node.id === draggedNode
              ? { ...node, x: Math.max(0, Math.min(newX, 800)), y: Math.max(0, Math.min(newY, 600)) }
              : node,
          ),
        )
      }
    },
    [draggedNode, dragOffset, nodes],
  )

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null)
  }, [])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (mode === "add-node" && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        const newNode: NetworkNode = {
          id: Date.now().toString(),
          x: e.clientX - rect.left - 25,
          y: e.clientY - rect.top - 25,
          type: "server",
          label: `Node ${nodes.length + 1}`,
          ip: `192.168.1.${10 + nodes.length}`, // Default IP address
        }
        setNodes([...nodes, newNode])
        setMode("select")
      }
    },
    [mode, nodes],
  )

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter((n) => n.id !== nodeId))
    setConnections(connections.filter((c) => c.from !== nodeId && c.to !== nodeId))
    setSelectedNode(null)
  }

  const deleteConnection = (connectionId: string) => {
    setConnections(connections.filter((c) => c.id !== connectionId))
    setSelectedConnection(null)
  }

  const updateNode = (nodeId: string, updates: Partial<NetworkNode>) => {
    const updatedNodes = nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node))
    setNodes(updatedNodes)

    // Update selectedNode if it's the node being updated
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode({ ...selectedNode, ...updates })
    }
  }

  const updateConnection = (connectionId: string, updates: Partial<NetworkConnection>) => {
    const updatedConnections = connections.map((conn) => (conn.id === connectionId ? { ...conn, ...updates } : conn))
    setConnections(updatedConnections)

    // Update selectedConnection if it's the connection being updated
    if (selectedConnection && selectedConnection.id === connectionId) {
      setSelectedConnection({ ...selectedConnection, ...updates })
    }
  }

  const getNodeColor = (type: string) => {
    return nodeTypes.find((t) => t.value === type)?.color || "#6b7280"
  }

  const saveToShip = () => {
    if (!selectedShipId) {
      alert("Please select a ship.")
      return
    }

    const selectedShip = ships.find((ship) => ship.id === selectedShipId)
    if (!selectedShip) {
      alert("Selected ship not found.")
      return
    }

    const topology: ShipTopology = {
      shipId: selectedShipId,
      shipName: selectedShip.name,
      nodes: [...nodes],
      connections: [...connections],
      lastModified: new Date().toISOString(),
    }

    const updatedTopologies = savedTopologies.filter((t) => t.shipId !== selectedShipId)
    updatedTopologies.push(topology)

    setSavedTopologies(updatedTopologies)
    localStorage.setItem("ship-topologies", JSON.stringify(updatedTopologies))

    alert(`${selectedShip.name} network topology saved to ship.`)
  }

  const loadFromShip = (shipId: string) => {
    const topology = savedTopologies.find((t) => t.shipId === shipId)
    if (topology) {
      setNodes(topology.nodes)
      setConnections(topology.connections)
      setSelectedShipId(shipId)
      alert(`${topology.shipName} network topology loaded from ship.`)
    } else {
      // 선박 선택만 변경하고 기본 토폴로지 유지
      setSelectedShipId(shipId)
    }
  }

  const exportTopology = () => {
    const selectedShip = ships.find((ship) => ship.id === selectedShipId)
    const data = {
      shipId: selectedShipId,
      shipName: selectedShip?.name || "Unknown",
      nodes,
      connections,
      lastModified: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `network-topology-${selectedShip?.name || "unknown"}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTopology = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.nodes && data.connections) {
            setNodes(data.nodes)
            setConnections(data.connections)
            if (data.shipId) {
              setSelectedShipId(data.shipId)
            }
          }
        } catch (error) {
          alert("Invalid file format.")
        }
      }
      reader.readAsText(file)
    }
  }

  const selectedShip = ships.find((ship) => ship.id === selectedShipId)
  const currentTopology = savedTopologies.find((t) => t.shipId === selectedShipId)

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const zoomSpeed = 0.1
    const minZoom = 0.5
    const maxZoom = 3.0

    setZoomLevel((prevZoom) => {
      const newZoom = e.deltaY > 0 ? prevZoom - zoomSpeed : prevZoom + zoomSpeed
      return Math.min(Math.max(newZoom, minZoom), maxZoom)
    })
  }, [])

  const addConnection = () => {
    if (nodes.length < 2) {
      alert("Need at least 2 nodes to create a connection.")
      return
    }

    const newConnection: NetworkConnection = {
      id: Date.now().toString(),
      from: nodes[0].id,
      to: nodes[1].id,
      type: "ethernet",
      bandwidth: "1Gbps",
      label: `Connection ${connections.length + 1}`,
    }
    setConnections([...connections, newConnection])
    setSelectedConnection(newConnection)
  }

  const getConnectionFromNode = (connectionId: string) => {
    const connection = connections.find((c) => c.id === connectionId)
    if (!connection) return null
    return nodes.find((n) => n.id === connection.from)
  }

  const getConnectionToNode = (connectionId: string) => {
    const connection = connections.find((c) => c.id === connectionId)
    if (!connection) return null
    return nodes.find((n) => n.id === connection.to)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Network Topology GUI Editor</h1>
        <div className="flex gap-2">
          <Button onClick={exportTopology} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => document.getElementById("import-file")?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <input id="import-file" type="file" accept=".json" onChange={importTopology} className="hidden" />
          <Button onClick={saveToShip} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save to Ship
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Ship Integration Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Select Ship to Connect</Label>
              <Select value={selectedShipId} onValueChange={loadFromShip}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a ship" />
                </SelectTrigger>
                <SelectContent>
                  {ships.map((ship) => (
                    <SelectItem key={ship.id} value={ship.id}>
                      {ship.name} ({ship.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Selected Ship</Label>
              <div className="flex items-center gap-2 mt-2">
                {selectedShip ? (
                  <>
                    <Badge variant="outline">{selectedShip.name}</Badge>
                    <Badge variant="secondary">{selectedShip.id}</Badge>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Please select a ship</span>
                )}
              </div>
            </div>
            <div>
              <Label>Topology Status</Label>
              <div className="flex items-center gap-2 mt-2">
                {currentTopology ? (
                  <>
                    <Badge className="bg-green-500">Saved</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(currentTopology.lastModified).toLocaleString()}
                    </span>
                  </>
                ) : (
                  <Badge variant="outline">Not Saved</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tools */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mode</Label>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant={mode === "select" ? "default" : "outline"}
                  onClick={() => setMode("select")}
                  className="justify-start"
                >
                  <Move className="w-4 h-4 mr-2" />
                  Select/Move
                </Button>
                <Button
                  variant={mode === "add-node" ? "default" : "outline"}
                  onClick={() => setMode("add-node")}
                  className="justify-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Node
                </Button>
                <Button
                  variant={mode === "add-connection" ? "default" : "outline"}
                  onClick={() => setMode("add-connection")}
                  className="justify-start"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Add Connection
                </Button>
              </div>
            </div>

            {savedTopologies.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <Label>Saved Topologies</Label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {savedTopologies.map((topology) => (
                    <div
                      key={topology.shipId}
                      className="flex items-center justify-between p-2 bg-muted rounded text-xs"
                    >
                      <span className="truncate">{topology.shipName}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => loadFromShip(topology.shipId)}
                        className="h-6 px-2"
                      >
                        Load
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedNode && (
              <div className="space-y-3 pt-4 border-t">
                <Label>Selected Node</Label>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={selectedNode.label}
                      onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={selectedNode.type}
                      onValueChange={(value) => updateNode(selectedNode.id, { type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {nodeTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">IP Address</Label>
                    <Input
                      value={selectedNode.ip || ""}
                      onChange={(e) => updateNode(selectedNode.id, { ip: e.target.value })}
                      placeholder="192.168.1.1"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteNode(selectedNode.id)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Node
                  </Button>
                </div>
              </div>
            )}

            {selectedConnection && (
              <div className="space-y-3 pt-4 border-t">
                <Label>Selected Connection</Label>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">From Node</Label>
                    <Select
                      value={selectedConnection.from}
                      onValueChange={(value) => updateConnection(selectedConnection.id, { from: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.label} ({node.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">To Node</Label>
                    <Select
                      value={selectedConnection.to}
                      onValueChange={(value) => updateConnection(selectedConnection.id, { to: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.label} ({node.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={selectedConnection.label || ""}
                      onChange={(e) => updateConnection(selectedConnection.id, { label: e.target.value })}
                      placeholder="Connection label"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Connection Type</Label>
                    <Select
                      value={selectedConnection.type}
                      onValueChange={(value) => updateConnection(selectedConnection.id, { type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {connectionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Bandwidth</Label>
                    <Input
                      value={selectedConnection.bandwidth || ""}
                      onChange={(e) => updateConnection(selectedConnection.id, { bandwidth: e.target.value })}
                      placeholder="1Gbps"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteConnection(selectedConnection.id)}
                    className="w-full mt-2"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Connection
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              Network Topology
              {selectedShip && (
                <Badge variant="outline" className="ml-2">
                  {selectedShip.name}
                </Badge>
              )}
              <Badge variant="secondary" className="ml-2">
                Zoom: {Math.round(zoomLevel * 100)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={canvasRef}
              className="relative w-full h-[600px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden cursor-crosshair"
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
              style={{ touchAction: "none" }}
            >
              <div
                className="w-full h-full"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                  transition: "transform 0.1s ease-out",
                }}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {connections.map((connection) => {
                    const fromNode = nodes.find((n) => n.id === connection.from)
                    const toNode = nodes.find((n) => n.id === connection.to)
                    if (!fromNode || !toNode) return null

                    const connectionType = connectionTypes.find((t) => t.value === connection.type)
                    const isSelected = selectedConnection?.id === connection.id

                    const fromCenterX = fromNode.x + 25
                    const fromCenterY = fromNode.y + 25
                    const toCenterX = toNode.x + 25
                    const toCenterY = toNode.y + 25

                    // Calculate direction vector
                    const dx = toCenterX - fromCenterX
                    const dy = toCenterY - fromCenterY
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    // Node radius is 25px (half of 50px node size)
                    const nodeRadius = 25

                    // Calculate start and end points at node edges
                    const startX = fromCenterX + (dx / distance) * nodeRadius
                    const startY = fromCenterY + (dy / distance) * nodeRadius
                    const endX = toCenterX - (dx / distance) * nodeRadius
                    const endY = toCenterY - (dy / distance) * nodeRadius

                    return (
                      <g key={connection.id}>
                        <defs>
                          <marker
                            id={`arrowhead-${connection.id}`}
                            markerWidth="8"
                            markerHeight="6"
                            refX="7"
                            refY="3"
                            orient="auto"
                          >
                            <polygon points="0 0, 8 3, 0 6" fill={connectionType?.color || "#374151"} />
                          </marker>
                        </defs>
                        <line
                          x1={startX}
                          y1={startY}
                          x2={endX}
                          y2={endY}
                          stroke={connectionType?.color || "#374151"}
                          strokeWidth={isSelected ? 4 : connection.type === "fiber" ? 3 : 2}
                          strokeDasharray={connection.type === "wireless" ? "5,5" : "none"}
                          markerEnd={connectionType?.style === "arrow" ? `url(#arrowhead-${connection.id})` : "none"}
                          className="cursor-pointer pointer-events-auto"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedConnection(connection)
                            setSelectedNode(null)
                          }}
                        />
                        {connection.label && (
                          <text
                            x={(fromCenterX + toCenterX) / 2}
                            y={(fromCenterY + toCenterY) / 2 - 5}
                            fill="#374151"
                            fontSize="10"
                            textAnchor="middle"
                            className="pointer-events-none font-medium"
                          >
                            {connection.label}
                          </text>
                        )}
                        {connection.bandwidth && (
                          <text
                            x={(fromCenterX + toCenterX) / 2}
                            y={(fromCenterY + toCenterY) / 2 + (connection.label ? 10 : 5)}
                            fill="#6b7280"
                            fontSize="9"
                            textAnchor="middle"
                            className="pointer-events-none"
                          >
                            {connection.bandwidth}
                          </text>
                        )}
                      </g>
                    )
                  })}
                </svg>

                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="absolute cursor-pointer select-none"
                    style={{ left: node.x, top: node.y }}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedNode(node)
                      setSelectedConnection(null)
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: getNodeColor(node.type) }}
                    >
                      {node.type.charAt(0).toUpperCase()}
                    </div>
                    <div className="mt-1 text-xs text-center font-medium text-gray-700 min-w-20 whitespace-nowrap">
                      {node.label}
                    </div>
                    {node.ip && (
                      <div className="text-xs text-center text-gray-500 min-w-20 whitespace-nowrap">{node.ip}</div>
                    )}
                  </div>
                ))}

                {connectionStart && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    Select target node to connect
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
