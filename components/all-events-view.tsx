"use client"

import * as React from "react"
import type { Ship } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowUpDown, Search } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface AllEventsViewProps {
  ships: Ship[]
  onBack: () => void
}

type SortKey = "timestamp" | "type" | "shipName" | "severity" | "message"

export default function AllEventsView({ ships, onBack }: AllEventsViewProps) {
  const [filters, setFilters] = React.useState({
    severity: "",
    type: "",
    shipName: "",
    search: "",
  })
  const [sort, setSort] = React.useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "timestamp",
    direction: "desc",
  })

  const allEvents = React.useMemo(() => {
    return ships.flatMap((ship) =>
      (ship.securityEvents || []).map((event) => ({
        ...event,
        shipName: ship.name,
        shipId: ship.id,
      })),
    )
  }, [ships])

  const filteredAndSortedEvents = React.useMemo(() => {
    let filtered = [...allEvents]

    if (filters.severity) filtered = filtered.filter((e) => e.severity === filters.severity)
    if (filters.type) filtered = filtered.filter((e) => e.type === filters.type)
    if (filters.shipName) filtered = filtered.filter((e) => e.shipName === filters.shipName)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.eventName.toLowerCase().includes(searchLower) ||
          e.details.toLowerCase().includes(searchLower) ||
          e.shipName.toLowerCase().includes(searchLower),
      )
    }

    filtered.sort((a, b) => {
      const valA = a[sort.key]
      const valB = b[sort.key]
      if (valA === null || valA === undefined) return 1
      if (valB === null || valB === undefined) return -1
      let comparison = 0
      if (sort.key === "timestamp") {
        comparison = new Date(valA).getTime() - new Date(valB).getTime()
      } else if (typeof valA === "string" && typeof valB === "string") {
        comparison = valA.localeCompare(valB)
      }
      return sort.direction === "asc" ? comparison : -comparison
    })

    return filtered
  }, [allEvents, filters, sort])

  const handleSort = (key: SortKey) => {
    setSort((prev) => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }))
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-500 text-black hover:bg-yellow-500/80">
            Warning
          </Badge>
        )
      case "notice":
        return (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-500/80">
            Notice
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  return (
    <div className="w-full h-full p-4 md:p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-4 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Map
        </Button>
        <Card>
          <CardHeader>
            <h1 className="text-2xl md:text-3xl font-bold">Detailed Event Information</h1>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Move filters right above the table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select value={filters.type} onValueChange={(v) => setFilters((f) => ({ ...f, type: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Infra">Infra</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Network">Network</SelectItem>
                  <SelectItem value="Application">Application</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.shipName} onValueChange={(v) => setFilters((f) => ({ ...f, shipName: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Ship Name" />
                </SelectTrigger>
                <SelectContent>
                  {ships.map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.severity} onValueChange={(v) => setFilters((f) => ({ ...f, severity: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="notice">Notice</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search message..."
                  value={filters.search}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Table immediately follows filters */}
            <div className="overflow-x-auto max-h-[60vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-muted">
                  <TableRow>
                    <TableHead onClick={() => handleSort("timestamp")} className="cursor-pointer">
                      Timestamp <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead onClick={() => handleSort("type")} className="cursor-pointer">
                      Type <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead onClick={() => handleSort("shipName")} className="cursor-pointer">
                      Ship Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead onClick={() => handleSort("severity")} className="cursor-pointer">
                      Severity <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedEvents.map((event, index) => (
                    <TableRow key={`${event.timestamp}-${index}`}>
                      <TableCell>
                        {new Date(event.timestamp).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}
                      </TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>{event.shipName}</TableCell>
                      <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                      <TableCell className="max-w-md truncate">{event.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
