"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { recommendationsData } from "@/lib/data"

interface EventListProps {
  events: any[]
  filters: { severity: string; type: string; search: string }
  setFilters: React.Dispatch<React.SetStateAction<{ severity: string; type: string; search: string }>>
  statusFilter?: "critical" | "warning" | "ok" | null
}

type SortKey = "timestamp" | "type" | "cbsName" | "severity"

export default function EventList({ events, filters, setFilters, statusFilter }: EventListProps) {
  const [sort, setSort] = React.useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "timestamp",
    direction: "desc",
  })

  const handleSort = (key: SortKey) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const getRecommendations = (severity: string) => {
    const severityKey = severity?.toLowerCase() as keyof typeof recommendationsData
    const recommendations = recommendationsData[severityKey]
    if (!recommendations || recommendations.length === 0) {
      return "No action"
    }

    const actionMap: Record<string, string> = {
      critical: "Isolate Now",
      warning: "Monitor",
      notice: "Review",
    }

    return actionMap[severityKey] || "Review"
  }

  const getFullRecommendations = (severity: string) => {
    const severityKey = severity?.toLowerCase() as keyof typeof recommendationsData
    const recommendations = recommendationsData[severityKey]
    if (!recommendations || recommendations.length === 0) {
      return "No specific recommendations available"
    }
    return recommendations.join("\n• ")
  }

  const filteredAndSortedEvents = React.useMemo(() => {
    let filtered = [...events]

    if (statusFilter) {
      filtered = filtered.filter((event) => {
        const severity = event.severity?.toLowerCase()
        if (statusFilter === "critical") {
          return severity === "critical"
        } else if (statusFilter === "warning") {
          return severity === "warning"
        } else if (statusFilter === "ok") {
          return severity === "notice" // OK status shows only notice events
        }
        return true
      })
    }

    if (filters.severity) {
      filtered = filtered.filter((event) => event.severity === filters.severity)
    }
    if (filters.type) {
      filtered = filtered.filter((event) => event.type === filters.type)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.eventName.toLowerCase().includes(searchLower) ||
          event.details.toLowerCase().includes(searchLower) ||
          event.cbsName.toLowerCase().includes(searchLower),
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
  }, [events, filters, sort, statusFilter])

  const resetFilters = () => {
    setFilters({ severity: "", type: "", search: "" })
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

  const getDetailedActions = (severity: string) => {
    const severityKey = severity?.toLowerCase() as keyof typeof recommendationsData
    const recommendations = recommendationsData[severityKey]

    if (!recommendations || recommendations.length === 0) {
      return {
        title: "No Actions Required",
        actions: ["No specific actions needed at this time."],
      }
    }

    const actionDetails: Record<string, { title: string; actions: string[] }> = {
      critical: {
        title: "Critical Security Response",
        actions: [
          "Immediately isolate the affected system from the network",
          "Contact the security team and incident response coordinator",
          "Document all current system states and network connections",
          "Begin forensic data collection before any remediation",
          "Notify relevant stakeholders and management",
          "Activate emergency response procedures",
          "Monitor for lateral movement or additional compromised systems",
        ],
      },
      warning: {
        title: "Security Monitoring Required",
        actions: [
          "Increase monitoring frequency for the affected system",
          "Review recent access logs and user activities",
          "Check for unusual network traffic patterns",
          "Verify system configurations against security baselines",
          "Schedule security assessment within 24 hours",
          "Update threat intelligence feeds",
          "Prepare incident response team for potential escalation",
        ],
      },
      notice: {
        title: "Routine Security Review",
        actions: [
          "Review system logs for any anomalies",
          "Verify compliance with security policies",
          "Update security documentation if needed",
          "Schedule routine security assessment",
          "Check for available security updates",
          "Review user access permissions",
          "Document findings in security log",
        ],
      },
    }

    return (
      actionDetails[severityKey] || {
        title: "General Review",
        actions: ["Review the event and take appropriate action based on your security policies."],
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="max-w-sm"
          />
          <Select value={filters.severity} onValueChange={(v) => setFilters((f) => ({ ...f, severity: v }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="notice">Notice</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.type} onValueChange={(v) => setFilters((f) => ({ ...f, type: v }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Infra">Infra</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Network">Network</SelectItem>
              <SelectItem value="Application">Application</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        <div className="overflow-x-auto max-h-[400px]">
          <Table className="min-w-[800px]">
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead onClick={() => handleSort("timestamp")} className="cursor-pointer w-[140px]">
                  Timestamp <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort("severity")} className="cursor-pointer w-[100px]">
                  Severity <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort("type")} className="cursor-pointer w-[100px]">
                  Type <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="w-[150px]">Event Name</TableHead>
                <TableHead className="w-[200px]">Details</TableHead>
                <TableHead className="w-[110px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEvents.map((event, index) => {
                const actionDetails = getDetailedActions(event.severity)
                return (
                  <TableRow key={`${event.timestamp}-${index}`}>
                    <TableCell className="w-[140px]">
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
                    <TableCell className="w-[100px]">{getSeverityBadge(event.severity)}</TableCell>
                    <TableCell className="w-[100px]">{event.type}</TableCell>
                    <TableCell className="w-[150px]">{event.eventName}</TableCell>
                    <TableCell className="w-[200px] whitespace-normal break-words">{event.details}</TableCell>
                    <TableCell className="w-[110px]">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-0 h-auto font-medium"
                          >
                            {getRecommendations(event.severity)}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {getSeverityBadge(event.severity)}
                              {actionDetails.title}
                            </DialogTitle>
                            <DialogDescription>
                              Event: {event.eventName} | Type: {event.type}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Event Details:</h4>
                              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{event.details}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-3">Recommended Actions:</h4>
                              <ul className="space-y-2">
                                {actionDetails.actions.map((action, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                                    <span className="text-sm">{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
