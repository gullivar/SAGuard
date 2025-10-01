"use client"

import * as React from "react"
import type { Asset } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
<<<<<<< HEAD
=======
import { TrendingUp, ServerCrash, Thermometer, HardDrive } from "lucide-react"
>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a

interface ResourceMonitoringProps {
  assets: Asset[]
  selectedAssetId?: string | null
  onAssetSelect: (asset: Asset) => void
}

const generate24HourData = (baseUsage: number, resourceType: "cpu" | "memory" | "disk") => {
  const data = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hour = time.getHours()

    // Create realistic usage patterns based on time of day
    let usage = baseUsage

    if (resourceType === "cpu") {
      // CPU usage typically higher during business hours
      if (hour >= 8 && hour <= 18) {
        usage += Math.random() * 20 - 5 // Higher during day
      } else {
        usage += Math.random() * 10 - 10 // Lower at night
      }
    } else if (resourceType === "memory") {
      // Memory usage more stable but can spike
      usage += Math.random() * 15 - 7.5
    } else if (resourceType === "disk") {
      // Disk usage generally stable with occasional spikes
      usage += Math.random() * 10 - 5
    }

    // Add some random fluctuation
    usage += (Math.random() - 0.5) * 8

    // Keep within bounds
    usage = Math.max(5, Math.min(95, usage))

    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      value: Math.round(usage * 10) / 10,
      timestamp: time.getTime(),
    })
  }

  return data
}

function SimpleLineChart({ data, activeTab }: { data: any[]; activeTab: string }) {
  const [containerSize, setContainerSize] = React.useState({ width: 600, height: 300 })
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({
          width: Math.max(400, Math.min(800, rect.width - 40)),
          height: 300,
        })
      }
    }

    updateSize()

    // Use ResizeObserver with error handling
    let resizeObserver: ResizeObserver | null = null

    try {
      resizeObserver = new ResizeObserver((entries) => {
        // Debounce resize updates
        setTimeout(updateSize, 100)
      })

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }
    } catch (error) {
      // Fallback to window resize if ResizeObserver fails
      window.addEventListener("resize", updateSize)
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      } else {
        window.removeEventListener("resize", updateSize)
      }
    }
  }, [])

  const width = containerSize.width
  const height = containerSize.height
  const margin = { top: 20, right: 30, bottom: 40, left: 60 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data available</div>
  }

  const maxValue = 100
  const minValue = 0

  // Create path for the line
  const pathData = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * chartWidth
      const y = chartHeight - ((point.value - minValue) / (maxValue - minValue)) * chartHeight
      return `${index === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  // Y-axis ticks
  const yTicks = [0, 20, 40, 60, 80, 100]

  // X-axis ticks (show every 4 hours)
  const xTicks = data.filter((_, index) => index % 4 === 0)

  return (
    <div ref={containerRef} className="w-full h-[300px] flex items-center justify-center">
      <svg width={width} height={height} className="border rounded">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 30" fill="none" stroke="hsl(var(--muted-foreground) / 0.1)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={chartWidth} height={chartHeight} x={margin.left} y={margin.top} fill="url(#grid)" />

        {/* Y-axis */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + chartHeight}
          stroke="hsl(var(--muted-foreground) / 0.3)"
          strokeWidth="1"
        />

        {/* X-axis */}
        <line
          x1={margin.left}
          y1={margin.top + chartHeight}
          x2={margin.left + chartWidth}
          y2={margin.top + chartHeight}
          stroke="hsl(var(--muted-foreground) / 0.3)"
          strokeWidth="1"
        />

        {/* Y-axis labels */}
        {yTicks.map((tick) => {
          const y = margin.top + chartHeight - ((tick - minValue) / (maxValue - minValue)) * chartHeight
          return (
            <g key={tick}>
              <line
                x1={margin.left - 5}
                y1={y}
                x2={margin.left}
                y2={y}
                stroke="hsl(var(--muted-foreground) / 0.3)"
                strokeWidth="1"
              />
              <text x={margin.left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="hsl(var(--muted-foreground))">
                {tick}%
              </text>
            </g>
          )
        })}

        {/* X-axis labels */}
        {xTicks.map((point, index) => {
          const x = margin.left + (data.indexOf(point) / (data.length - 1)) * chartWidth
          return (
            <g key={index}>
              <line
                x1={x}
                y1={margin.top + chartHeight}
                x2={x}
                y2={margin.top + chartHeight + 5}
                stroke="hsl(var(--muted-foreground) / 0.3)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={margin.top + chartHeight + 20}
                textAnchor="middle"
                fontSize="11"
                fill="hsl(var(--muted-foreground))"
              >
                {point.time}
              </text>
            </g>
          )
        })}

        {/* Data line */}
        <path
          d={pathData}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          transform={`translate(${margin.left}, ${margin.top})`}
        />

        {/* Data points */}
        {data.map((point, index) => {
          const x = margin.left + (index / (data.length - 1)) * chartWidth
          const y = margin.top + chartHeight - ((point.value - minValue) / (maxValue - minValue)) * chartHeight
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="hsl(var(--primary))"
              className="hover:r-4 transition-all cursor-pointer"
            >
              <title>{`${point.time}: ${point.value}%`}</title>
            </circle>
          )
        })}

        {/* Y-axis label */}
        <text
          x={20}
          y={margin.top + chartHeight / 2}
          textAnchor="middle"
          fontSize="12"
          fill="hsl(var(--muted-foreground))"
          transform={`rotate(-90, 20, ${margin.top + chartHeight / 2})`}
        >
          Usage (%)
        </text>
      </svg>
    </div>
  )
}

export default function ResourceMonitoring({ assets, selectedAssetId, onAssetSelect }: ResourceMonitoringProps) {
  const [activeTab, setActiveTab] = React.useState<"cpu" | "memory" | "disk">("cpu")

  const top5Assets = React.useMemo(() => {
    return [...assets].sort((a, b) => (b[`${activeTab}Usage`] ?? 0) - (a[`${activeTab}Usage`] ?? 0)).slice(0, 5)
  }, [assets, activeTab])

  const selectedAsset = React.useMemo(() => {
    return assets.find((a) => a.assetId === selectedAssetId) || top5Assets[0] || null
  }, [assets, selectedAssetId, top5Assets])

  const chartData = React.useMemo(() => {
    if (!selectedAsset) return []

    const baseUsage = selectedAsset[`${activeTab}Usage`] ?? 50
    return generate24HourData(baseUsage, activeTab)
  }, [selectedAsset, activeTab])

  const getProgressColor = (value: number) => {
    if (value > 85) return "bg-red-500"
    if (value > 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Monitoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
<<<<<<< HEAD
=======
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-muted/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Load Systems</CardTitle>
              <ServerCrash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assets.filter((a) => (a.cpuUsage ?? 0) > 85 || (a.memoryUsage ?? 0) > 85).length}
              </div>
              <p className="text-xs text-muted-foreground">Assets over 85% utilization</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. CPU</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(assets.reduce((sum, a) => sum + (a.cpuUsage ?? 0), 0) / assets.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Average CPU utilization</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Memory</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(assets.reduce((sum, a) => sum + (a.memoryUsage ?? 0), 0) / assets.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Average memory utilization</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Disk</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(assets.reduce((sum, a) => sum + (a.diskUsage ?? 0), 0) / assets.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Average disk utilization</p>
            </CardContent>
          </Card>
        </div>

>>>>>>> 635fb68316ea188d00a1ccbf846d7710502b0e5a
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cpu">CPU</TabsTrigger>
                <TabsTrigger value="memory">Memory</TabsTrigger>
                <TabsTrigger value="disk">Disk</TabsTrigger>
              </TabsList>
              <TabsContent value="cpu">
                <Top5List assets={top5Assets} resource="cpu" onAssetSelect={onAssetSelect} />
              </TabsContent>
              <TabsContent value="memory">
                <Top5List assets={top5Assets} resource="memory" onAssetSelect={onAssetSelect} />
              </TabsContent>
              <TabsContent value="disk">
                <Top5List assets={top5Assets} resource="disk" onAssetSelect={onAssetSelect} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedAsset?.typeComponentModelNo || "Select an Asset"} - {activeTab.toUpperCase()} Usage History
                  (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleLineChart data={chartData} activeTab={activeTab} />
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Top5List({
  assets,
  resource,
  onAssetSelect,
}: {
  assets: Asset[]
  resource: "cpu" | "memory" | "disk"
  onAssetSelect: (asset: Asset) => void
}) {
  const getProgressColor = (value: number) => {
    if (value > 85) return "bg-red-500"
    if (value > 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="mt-4 space-y-4">
      {assets.map((asset) => {
        const usage = asset[`${resource}Usage`] ?? 0
        return (
          <div key={asset.assetId} className="space-y-1 cursor-pointer" onClick={() => onAssetSelect(asset)}>
            <div className="flex justify-between text-sm">
              <span className="font-medium truncate" title={asset.typeComponentModelNo}>
                {asset.typeComponentModelNo}
              </span>
              <span className="text-muted-foreground">{usage.toFixed(1)}%</span>
            </div>
            <Progress value={usage} indicatorClassName={getProgressColor(usage)} />
          </div>
        )
      })}
    </div>
  )
}
