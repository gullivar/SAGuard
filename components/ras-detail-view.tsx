"use client"

import * as React from "react"
import type { Ship } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, X, Wifi, WifiOff, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { generateV16MockData, type CbsV16, type ConnectionV16 } from "@/lib/ras-data-v16"
const vis = typeof window !== "undefined" ? require("vis-network/standalone") : null

interface RasDetailViewProps {
  ship: Ship | null
  onBack: () => void
}

const format24HourTime = (date: Date) => {
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "")
}

export default function RasDetailView({ ship, onBack }: RasDetailViewProps) {
  const visNetworkRef = React.useRef<HTMLDivElement>(null)
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
  const [v16Data] = React.useState(() => generateV16MockData())

  const getStatusIcon = (status: CbsV16["status"]) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      case "maintenance":
        return <Settings className="h-4 w-4 text-yellow-500" />
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: ConnectionV16["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      case "Idle":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Idle</Badge>
      case "Disconnected":
        return <Badge variant="destructive">Disconnected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  React.useEffect(() => {
    if (visNetworkRef.current && vis && v16Data) {
      const userNodes = v16Data.users.map((user) => ({
        id: user.id,
        label: `${user.id}\n(${user.activeConnections} CBS)`,
        group: "user",
        title: `${user.name} - ${user.role}\n부서: ${user.department}`,
      }))

      const cbsNodes = v16Data.cbs.map((cbs) => ({
        id: cbs.id,
        label: `${cbs.name}\n(${cbs.connectionCount} Users)`,
        group: cbs.status,
        title: `${cbs.name}\nIP: ${cbs.ip}\n위치: ${cbs.location}\n상태: ${cbs.status}`,
      }))

      const nodes = new vis.DataSet([...userNodes, ...cbsNodes])

      const edges = new vis.DataSet(
        v16Data.connections
          .filter((conn) => conn.status === "Active")
          .map((conn) => ({
            from: conn.userId,
            to: conn.cbsId,
            color: {
              color: conn.priority === "High" ? "#ef4444" : conn.priority === "Medium" ? "#f97316" : "#22c55e",
            },
            width: conn.priority === "High" ? 3 : 2,
            title: `${conn.connectionType} - ${conn.priority} Priority\nBandwidth: ${conn.bandwidth} Mbps`,
          })),
      )

      const data = { nodes, edges }
      const options = {
        autoResize: true,
        height: "600px",
        width: "100%",
        layout: {
          hierarchical: {
            enabled: true,
            direction: "LR",
            sortMethod: "hubsize",
          },
        },
        physics: false,
        interaction: {
          tooltipDelay: 200,
          hover: true,
        },
        nodes: {
          font: { color: "#ffffff" },
        },
        edges: {
          arrows: "to",
          smooth: {
            type: "cubicBezier",
          },
        },
        groups: {
          user: {
            shape: "ellipse",
            color: { background: "#be123c", border: "#fecdd3" },
            font: { size: 16 },
          },
          online: {
            shape: "box",
            color: { background: "#166534", border: "#bbf7d0" },
          },
          offline: {
            shape: "box",
            color: { background: "#7f1d1d", border: "#fecaca" },
          },
          maintenance: {
            shape: "box",
            color: { background: "#a16207", border: "#fef3c7" },
          },
        },
      }

      const network = new vis.Network(visNetworkRef.current, data, options)

      // Handle user node clicks
      network.on("click", (params) => {
        if (params.nodes.length > 0) {
          const clickedNodeId = params.nodes[0]
          const user = v16Data.users.find((u) => u.id === clickedNodeId)
          if (user) {
            setSelectedUserId(clickedNodeId)
          }
        }
      })

      return () => {
        network.destroy()
      }
    }
  }, [v16Data])

  const selectedUser = v16Data.users.find((u) => u.id === selectedUserId)
  const userConnections = selectedUserId ? v16Data.connections.filter((conn) => conn.userId === selectedUserId) : []

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
    <div className="w-full h-full p-4 md:p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-4 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Ship Detail
        </Button>

        {/* Centered title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{ship.name} Detailed Connection Information</h1>
          <p className="text-muted-foreground mt-2">Version 16 Enhanced Data</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <div className="space-y-1">
                <Input type="date" placeholder="YY-MM-DD Start" />
              </div>
              <div className="space-y-1">
                <Input type="date" placeholder="YY-MM-DD End" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="User ID" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {v16Data.users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.id} ({user.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Connection Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="VPN">VPN</SelectItem>
                  <SelectItem value="Direct">Direct</SelectItem>
                  <SelectItem value="Satellite">Satellite</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Duration (min+)" />
              <Input placeholder="Bandwidth (Mbps+)" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Connection Graph */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Connection Status (CBS: {v16Data.cbs.length}, Active:{" "}
                  {v16Data.cbs.filter((c) => c.status === "online").length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={visNetworkRef} className="h-[600px] w-full bg-muted/20 rounded-lg" />
              </CardContent>
            </Card>
          </div>

          {/* User Connection Details */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {selectedUser ? `${selectedUser.name} (${selectedUser.id})` : "User Selection"}
                </CardTitle>
                {selectedUserId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUserId(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {selectedUser ? (
                  <div>
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium">Role:</span> {selectedUser.role}
                        </p>
                        <p>
                          <span className="font-medium">Department:</span> {selectedUser.department}
                        </p>
                        <p>
                          <span className="font-medium">Last Login:</span> {format24HourTime(selectedUser.lastLogin)}
                        </p>
                        <p>
                          <span className="font-medium">Active Connections:</span> {selectedUser.activeConnections}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">Connected CBS List</p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-muted-foreground border-b pb-2">
                        <span>CBS Name</span>
                        <span>IP Address</span>
                        <span>Status</span>
                        <span>Bandwidth</span>
                      </div>
                      {userConnections.map((connection) => {
                        const cbs = v16Data.cbs.find((c) => c.id === connection.cbsId)
                        return (
                          <div
                            key={connection.connId}
                            className="grid grid-cols-4 gap-2 text-sm py-2 border-b border-muted/50"
                          >
                            <div className="flex items-center gap-1">
                              {cbs && getStatusIcon(cbs.status)}
                              <span className="font-medium truncate" title={cbs?.name}>
                                {cbs?.name}
                              </span>
                            </div>
                            <span className="text-muted-foreground text-xs">{cbs?.ip}</span>
                            <div>{getStatusBadge(connection.status)}</div>
                            <span className="text-muted-foreground text-xs">{connection.bandwidth} Mbps</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Click on a user circle on the left</p>
                    <p>to view detailed connection information</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
