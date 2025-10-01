"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, RotateCcw, CalendarIcon, Eye } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { generateDetectionEvents, type DetectionEvent } from "@/lib/data"

const severityOptions = ["All", "Critical", "High", "Medium", "Low"]
const logSourceOptions = ["All", "Security", "System", "Application", "Syslog", "SNMP-Trap"]
const osOptions = ["All", "Windows", "Linux"]
const investigationStatusOptions = ["All", "New", "In Progress", "Resolved", "False Positive"]

const shipAssetOptions = ["All", "Green Nuri", "LNG Carrier #102", "Bulk Carrier #1", "Container Ship #2"]

export default function EventSearchPage() {
  const [detectionEvents, setDetectionEvents] = useState<DetectionEvent[]>(() => generateDetectionEvents())
  const [selectedEvent, setSelectedEvent] = useState<DetectionEvent | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [severity, setSeverity] = useState("All")
  const [logSource, setLogSource] = useState("All")
  const [osType, setOsType] = useState("All")
  const [selectedShipAsset, setSelectedShipAsset] = useState("All")
  const [messageKeyword, setMessageKeyword] = useState("")
  const [investigationStatus, setInvestigationStatus] = useState("All")

  const filteredEvents = useMemo(() => {
    return detectionEvents.filter((event) => {
      return (
        (severity === "All" || event.severityLevel === severity) &&
        (selectedShipAsset === "All" ||
          event.shipName === selectedShipAsset ||
          event.affectedAsset === selectedShipAsset) &&
        (messageKeyword === "" ||
          event.description.toLowerCase().includes(messageKeyword.toLowerCase()) ||
          event.detectionRule.toLowerCase().includes(messageKeyword.toLowerCase())) &&
        (investigationStatus === "All" || event.investigationStatus === investigationStatus)
      )
    })
  }, [severity, selectedShipAsset, messageKeyword, investigationStatus, detectionEvents])

  const resetFilters = () => {
    setDateRange(undefined)
    setSeverity("All")
    setLogSource("All")
    setOsType("All")
    setSelectedShipAsset("All")
    setMessageKeyword("")
    setInvestigationStatus("All")
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive"
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "default"
      default:
        return "default"
    }
  }

  const getInvestigationStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return <Badge variant="destructive">New</Badge>
      case "In Progress":
        return (
          <Badge variant="secondary" className="bg-yellow-500 text-black hover:bg-yellow-500/80">
            In Progress
          </Badge>
        )
      case "Resolved":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-500/80">
            Resolved
          </Badge>
        )
      case "False Positive":
        return <Badge variant="outline">False Positive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleStatusChange = (eventId: string, newStatus: DetectionEvent["investigationStatus"]) => {
    console.log("[v0] Changing investigation status for event", eventId, "to", newStatus)
    setDetectionEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, investigationStatus: newStatus } : event)),
    )
    // Update selected event if it's the one being changed
    if (selectedEvent?.id === eventId) {
      setSelectedEvent((prev) => (prev ? { ...prev, investigationStatus: newStatus } : null))
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
          <span className="text-white text-sm font-bold">D</span>
        </div>
        <h1 className="text-2xl font-bold text-blue-400">Detection Event Search</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detection Event Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent text-xs px-2 py-1 h-8"
                  >
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    <span className="truncate">
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yy")
                        )
                      ) : (
                        "Select date range"
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Severity</label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {severityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Ship/Asset</label>
              <Select value={selectedShipAsset} onValueChange={setSelectedShipAsset}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select ship or asset" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {shipAssetOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Investigation Status</label>
              <Select value={investigationStatus} onValueChange={setInvestigationStatus}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {investigationStatusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium mb-2 block">Message Keyword Search</label>
              <Input
                placeholder="Detection rule, description, asset name, etc."
                value={messageKeyword}
                onChange={(e) => setMessageKeyword(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={resetFilters} className="h-8 text-xs px-2 bg-transparent">
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
            <Button className="h-8 text-xs px-2">
              <Search className="w-3 h-3 mr-1" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Results: Detection Event List ({filteredEvents.length} events)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-blue-400">Detection Time</th>
                  <th className="text-left p-3 text-blue-400">Severity</th>
                  <th className="text-left p-3 text-blue-400">Ship Name</th>
                  <th className="text-left p-3 text-blue-400">Detection Rule</th>
                  <th className="text-left p-3 text-blue-400">Source Device</th>
                  <th className="text-left p-3 text-blue-400">Event Category</th>
                  <th className="text-left p-3 text-blue-400">Investigation Status</th>
                  <th className="text-left p-3 text-blue-400">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">{format(new Date(event.detectionTime), "dd/MM yyyy, HH:mm:ss")}</td>
                    <td className="p-3">
                      <Badge variant={getSeverityBadgeVariant(event.severityLevel)}>{event.severityLevel}</Badge>
                    </td>
                    <td className="p-3">{event.shipName}</td>
                    <td className="p-3 max-w-xs truncate" title={event.detectionRule}>
                      {event.detectionRule}
                    </td>
                    <td className="p-3">{event.sourceDevice}</td>
                    <td className="p-3">{event.eventCategory}</td>
                    <td className="p-3">{getInvestigationStatusBadge(event.investigationStatus)}</td>
                    <td className="p-3">
                      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detection Event Details</DialogTitle>
                          </DialogHeader>
                          {selectedEvent && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Detection Time</label>
                                  <p className="text-sm">
                                    {format(new Date(selectedEvent.detectionTime), "dd/MM yyyy, HH:mm:ss")}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Severity Level</label>
                                  <div className="mt-1">
                                    {getSeverityBadgeVariant(selectedEvent.severityLevel) && (
                                      <Badge variant={getSeverityBadgeVariant(selectedEvent.severityLevel)}>
                                        {selectedEvent.severityLevel}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Ship Name</label>
                                  <p className="text-sm">{selectedEvent.shipName}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Source Device</label>
                                  <p className="text-sm">{selectedEvent.sourceDevice}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Event Category</label>
                                  <p className="text-sm">{selectedEvent.eventCategory}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Affected Asset</label>
                                  <p className="text-sm">{selectedEvent.affectedAsset}</p>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Detection Rule</label>
                                <p className="text-sm">{selectedEvent.detectionRule}</p>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Description</label>
                                <p className="text-sm">{selectedEvent.description}</p>
                              </div>

                              <div className="border-t pt-4">
                                <label className="text-sm font-medium text-muted-foreground">
                                  Investigation Status
                                </label>
                                <div className="flex items-center gap-3 mt-2">
                                  <div>{getInvestigationStatusBadge(selectedEvent.investigationStatus)}</div>
                                  <Select
                                    value={selectedEvent.investigationStatus}
                                    onValueChange={(newStatus: DetectionEvent["investigationStatus"]) =>
                                      handleStatusChange(selectedEvent.id, newStatus)
                                    }
                                  >
                                    <SelectTrigger className="w-48 h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="New">New</SelectItem>
                                      <SelectItem value="In Progress">In Progress</SelectItem>
                                      <SelectItem value="Resolved">Resolved</SelectItem>
                                      <SelectItem value="False Positive">False Positive</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                                <div>
                                  <label className="font-medium">Elastic Rule ID</label>
                                  <p>{selectedEvent.elasticRuleId}</p>
                                </div>
                                <div>
                                  <label className="font-medium">Raw Data Reference</label>
                                  <p>{selectedEvent.rawDataReference}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
