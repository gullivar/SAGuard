"use client"

import * as React from "react"
import { X, User, Server, ZoomIn, ZoomOut, Maximize } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Connection, Cbs } from "@/lib/ras-data"
import { Button } from "@/components/ui/button"

// Props definition
interface CustomConnectionGraphProps {
  connections: Connection[]
  users: string[]
  cbs: Cbs[]
  highlightedConnectionId: string | null
}

// Helper functions for styling
const getUserBorderColor = (count: number) => {
  if (count >= 3) return "border-red-500"
  if (count >= 2) return "border-yellow-500"
  return "border-green-500"
}

const getCbsBorderColor = (count: number) => {
  if (count >= 10) return "border-red-500"
  if (count < 5) return "border-green-500"
  return "border-yellow-500"
}

const getEdgeColor = (duration: number) => {
  if (duration >= 120) return "stroke-red-500"
  if (duration < 60) return "stroke-green-500"
  return "stroke-yellow-500"
}

// Main Component - Changed to named export
export function CustomConnectionGraph({
  connections,
  users,
  cbs,
  highlightedConnectionId,
}: CustomConnectionGraphProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [view, setView] = React.useState({ x: 0, y: 0, zoom: 1 })
  const [draggingNode, setDraggingNode] = React.useState<{ id: string; offset: { x: number; y: number } } | null>(null)
  const [isPanning, setIsPanning] = React.useState(false)
  const [hoveredCbsId, setHoveredCbsId] = React.useState<string | null>(null)
  const [activeTooltip, setActiveTooltip] = React.useState<{ type: "user" | "cbs"; id: string } | null>(null)

  const { userNodes, cbsNodes, nodePositions, setNodePositions } = useHierarchicalLayout(users, cbs, connections)

  const handleFitView = React.useCallback(() => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    // Get all node positions
    const positions = Object.values(nodePositions)
    if (positions.length === 0) return

    const padding = 150 // Increased padding to ensure nodes aren't cut off
    const minX = Math.min(...positions.map((pos) => pos.x)) - padding
    const maxX = Math.max(...positions.map((pos) => pos.x)) + padding
    const minY = Math.min(...positions.map((pos) => pos.y)) - padding
    const maxY = Math.max(...positions.map((pos) => pos.y)) + padding

    const contentWidth = maxX - minX
    const contentHeight = maxY - minY

    const zoomX = (containerWidth * 0.9) / contentWidth // Use 90% of container width
    const zoomY = (containerHeight * 0.9) / contentHeight // Use 90% of container height
    const optimalZoom = Math.min(zoomX, zoomY, 1.5) // Cap at 1.5x zoom instead of 2x

    // Calculate center position
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    // Set view to center the content
    setView({
      x: containerWidth / 2 - centerX * optimalZoom,
      y: containerHeight / 2 - centerY * optimalZoom,
      zoom: optimalZoom,
    })
  }, [nodePositions])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleFitView()
    }, 0) // 0ms delay to run after rendering cycle

    return () => clearTimeout(timer)
  }, [handleFitView, userNodes.length, cbsNodes.length])

  // Event Handlers
  const handleZoomIn = () => setView((v) => ({ ...v, zoom: Math.min(3, v.zoom * 1.2) }))
  const handleZoomOut = () => setView((v) => ({ ...v, zoom: Math.max(0.2, v.zoom / 1.2) }))
  const handleResetView = () => setView({ x: 0, y: 0, zoom: 1 })

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const zoomFactor = 1.1
    const newZoom = e.deltaY < 0 ? view.zoom * zoomFactor : view.zoom / zoomFactor
    setView((v) => ({ ...v, zoom: Math.max(0.2, Math.min(3, newZoom)) }))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking on the background
    if (e.target === e.currentTarget) {
      setIsPanning(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setView((v) => ({ ...v, x: v.x + e.movementX, y: v.y + e.movementY }))
    }
    if (draggingNode) {
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (!containerRect) return
      // Adjust for container position, view pan, and zoom
      const newX = (e.clientX - containerRect.left - view.x) / view.zoom + draggingNode.offset.x
      const newY = (e.clientY - containerRect.top - view.y) / view.zoom + draggingNode.offset.y
      setNodePositions((pos) => ({ ...pos, [draggingNode.id]: { x: newX, y: newY } }))
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
    setDraggingNode(null)
  }

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const nodePos = nodePositions[id]
    // Calculate offset relative to the node's center for smoother dragging
    const offsetX =
      nodePos.x - (e.clientX - (containerRef.current?.getBoundingClientRect().left || 0) - view.x) / view.zoom
    const offsetY =
      nodePos.y - (e.clientY - (containerRef.current?.getBoundingClientRect().top || 0) - view.y) / view.zoom
    setDraggingNode({ id, offset: { x: offsetX, y: offsetY } })
  }

  const activeElements = React.useMemo(() => {
    if (hoveredCbsId) {
      const connectedUserIds = connections.filter((c) => c.cbsId === hoveredCbsId).map((c) => `user-${c.userId}`)
      return new Set([hoveredCbsId, ...connectedUserIds])
    }
    if (highlightedConnectionId) {
      const conn = connections.find((c) => c.connId === highlightedConnectionId)
      if (conn) return new Set([`user-${conn.userId}`, conn.cbsId])
    }
    return null
  }, [hoveredCbsId, highlightedConnectionId, connections])

  const isDimmed = (id: string) => (activeElements ? !activeElements.has(id) : false)

  return (
    <div className="bg-gray-800/50 border-gray-700 rounded-lg p-4 h-full w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white text-lg font-semibold">Connection Status (Unique CBS: {cbsNodes.length})</h2>
        <div className="flex items-center gap-1 bg-gray-800/50 border border-gray-700 rounded-md p-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleResetView}>
            <Maximize className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleFitView} title="Fit all nodes">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </Button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="w-full h-full bg-gray-900/50 rounded overflow-hidden relative cursor-grab active:cursor-grabbing"
        style={{ minHeight: "600px" }} // Increased minimum height for better visibility
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute top-0 left-0"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})` }}
        >
          <svg
            className="absolute top-0 left-0"
            style={{
              width: Math.max(
                4000,
                Object.values(nodePositions).reduce((max, pos) => Math.max(max, pos.x + 200), 0),
              ),
              height: Math.max(
                4000,
                Object.values(nodePositions).reduce((max, pos) => Math.max(max, pos.y + 200), 0),
              ),
              pointerEvents: "none",
            }}
          >
            {connections.map((conn) => {
              const sourcePos = nodePositions[`user-${conn.userId}`]
              const targetPos = nodePositions[conn.cbsId]
              if (!sourcePos || !targetPos) return null
              const isHighlighted = conn.connId === highlightedConnectionId
              const isHoverRelated = hoveredCbsId === conn.cbsId
              const isDimmed = activeElements ? !(isHoverRelated || isHighlighted) : false

              return (
                <line
                  key={conn.connId}
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  className={cn(
                    "stroke-2 transition-opacity",
                    isHighlighted ? "stroke-cyan-400" : getEdgeColor(conn.duration),
                    isDimmed ? "opacity-10" : "opacity-70",
                  )}
                  strokeWidth={isHighlighted ? 4 / view.zoom : 2 / view.zoom}
                />
              )
            })}
          </svg>
          {[...userNodes, ...cbsNodes].map((node) => (
            <div
              key={node.id}
              className={cn(
                "absolute p-2 border-4 rounded-lg cursor-pointer transition-all flex flex-col items-center justify-center text-white text-xs",
                node.type === "user" ? "rounded-full w-24 h-24" : "w-32 h-20",
                node.borderColor,
                isDimmed(node.id) ? "opacity-30" : "opacity-100",
                "hover:scale-110 hover:shadow-2xl hover:shadow-blue-400/80 hover:border-blue-400 hover:bg-blue-600/90",
                activeElements?.has(node.id) &&
                  "shadow-2xl shadow-cyan-400/90 bg-cyan-600/80 border-cyan-400 scale-105",
              )}
              style={{
                left: nodePositions[node.id]?.x,
                top: nodePositions[node.id]?.y,
                transform: "translate(-50%, -50%)",
                backgroundColor: activeElements?.has(node.id) ? "#0891b2" : "#2a2a2a",
              }}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              onMouseEnter={() => node.type === "cbs" && setHoveredCbsId(node.id)}
              onMouseLeave={() => node.type === "cbs" && setHoveredCbsId(null)}
              onClick={() => setActiveTooltip({ type: node.type, id: node.id })}
            >
              <div className="font-bold text-center">{node.label}</div>
              <div className="text-gray-400 text-center">{node.subLabel}</div>
            </div>
          ))}

          {activeTooltip && (
            <GraphTooltip
              tooltipInfo={activeTooltip}
              nodePositions={nodePositions}
              connections={connections}
              cbs={cbs}
              onClose={() => setActiveTooltip(null)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function useHierarchicalLayout(users: string[], cbs: Cbs[], connections: Connection[]) {
  const userConnectionCounts = React.useMemo(
    () =>
      connections.reduce(
        (acc, conn) => {
          acc[conn.userId] = (acc[conn.userId] || new Set()).add(conn.cbsId)
          return acc
        },
        {} as Record<string, Set<string>>,
      ),
    [connections],
  )

  const cbsConnectionCounts = React.useMemo(
    () =>
      connections.reduce(
        (acc, conn) => {
          acc[conn.cbsId] = (acc[conn.cbsId] || new Set()).add(conn.userId)
          return acc
        },
        {} as Record<string, Set<string>>,
      ),
    [connections],
  )

  const userNodes = users.map((id) => ({
    id: `user-${id}`,
    type: "user" as const,
    label: id,
    subLabel: `(${userConnectionCounts[id]?.size || 0} CBS)`,
    borderColor: getUserBorderColor(userConnectionCounts[id]?.size || 0),
    level: 0, // User nodes at level 0 (left side)
  }))

  const cbsNodes = cbs.slice(0, 10).map((cbs) => ({
    id: cbs.id,
    type: "cbs" as const,
    label: cbs.name,
    subLabel: `(${cbsConnectionCounts[cbs.id]?.size || 0} Users)`,
    borderColor: getCbsBorderColor(cbsConnectionCounts[cbs.id]?.size || 0),
    level: 1, // System nodes at level 1 (right side)
  }))

  const [nodePositions, setNodePositions] = React.useState(() => {
    const positions: Record<string, { x: number; y: number }> = {}

    const levelSeparation = 500 // Reduced from 600 for better fit
    const nodeSpacing = 80 // Reduced from 120 for more compact layout
    const startX = 150 // Reduced starting position
    const startY = 50 // Reduced starting Y position

    const maxNodes = Math.max(userNodes.length, cbsNodes.length)
    const dynamicSpacing = Math.max(nodeSpacing, Math.min(150, 600 / maxNodes)) // Adaptive spacing

    // Position user nodes (level 0) on the left
    userNodes.forEach((node, i) => {
      positions[node.id] = {
        x: startX,
        y: startY + i * dynamicSpacing,
      }
    })

    // Position CBS nodes (level 1) on the right
    cbsNodes.forEach((node, i) => {
      positions[node.id] = {
        x: startX + levelSeparation,
        y: startY + i * dynamicSpacing,
      }
    })

    return positions
  })

  return { userNodes, cbsNodes, nodePositions, setNodePositions }
}

function GraphTooltip({ tooltipInfo, nodePositions, connections, cbs, onClose }: any) {
  const pos = nodePositions[tooltipInfo.id]
  const isUser = tooltipInfo.type === "user"
  const cbsMap = new Map(cbs.map((c: Cbs) => [c.id, c]))

  const nodeData = isUser
    ? { id: tooltipInfo.id.replace("user-", "") }
    : { id: tooltipInfo.id, ...cbsMap.get(tooltipInfo.id) }

  const relatedConnections = isUser
    ? connections.filter((c: Connection) => `user-${c.userId}` === tooltipInfo.id)
    : connections.filter((c: Connection) => c.cbsId === tooltipInfo.id)

  if (!pos) return null

  const title = isUser ? `User: ${nodeData.id} (Connected CBS List)` : `CBS: ${nodeData.name} - Connected User Details`
  const Icon = isUser ? User : Server

  return (
    <div
      className="absolute bg-gray-900/90 backdrop-blur-sm border border-cyan-400 rounded-lg shadow-2xl p-3 text-white w-[500px] max-h-80 flex flex-col z-20"
      style={{ left: pos.x + 80, top: pos.y, transform: "translateY(-50%)" }}
    >
      <div className="flex items-center justify-between mb-2 border-b border-gray-700 pb-2">
        <h4 className="font-bold flex items-center gap-2">
          <Icon className="h-5 w-5 text-cyan-400" />
          {title}
        </h4>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={18} />
        </button>
      </div>
      <div className="overflow-y-auto text-xs">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-gray-900/90">
            <tr className="text-gray-400">
              {isUser ? (
                <>
                  <th>CBS Name</th>
                  <th>CBS IP Address</th>
                  <th className="text-right">Current Connection Time</th>
                </>
              ) : (
                <>
                  <th>User(s)</th>
                  <th>Initial Connection</th>
                  <th className="text-right">Duration(min)</th>
                  <th>Connection IP</th>
                  <th className="text-right">Sent(MB)</th>
                  <th className="text-right">Received(MB)</th>
                  <th className="text-right">Total Connections</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {relatedConnections.map((conn: Connection) => (
              <tr key={conn.connId} className="border-t border-gray-800 hover:bg-gray-800/50">
                {isUser ? (
                  <>
                    <td>{cbsMap.get(conn.cbsId)?.name}</td>
                    <td>{cbsMap.get(conn.cbsId)?.ip}</td>
                    <td className="text-right">
                      {new Date(conn.connTime).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                    </td>
                  </>
                ) : (
                  <>
                    <td>{conn.userId}</td>
                    <td>
                      {new Date(conn.connTime).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </td>
                    <td className="text-right">{conn.duration}</td>
                    <td>{cbsMap.get(conn.cbsId)?.ip}</td>
                    <td className="text-right">{(conn.sentBytes / (1024 * 1024)).toFixed(2)}</td>
                    <td className="text-right">{(conn.receivedBytes / (1024 * 1024)).toFixed(2)}</td>
                    <td className="text-right">1</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
